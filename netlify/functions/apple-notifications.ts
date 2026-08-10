import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Handler, HandlerEvent } from "@netlify/functions";
import {
  Environment,
  NotificationTypeV2,
  SignedDataVerifier,
} from "@apple/app-store-server-library";

const BUNDLE_ID = "com.yoansoussand.Rappel-Produit";
const APP_APPLE_ID = 6449599235;
const PREMIUM_PRODUCT_ID = "com.yoansoussand.rappelproduit.premium";

const moduleDir = dirname(fileURLToPath(import.meta.url));

type AlertEnv = {
  NTFY_TOPIC?: string;
  NTFY_TOKEN?: string;
  RESEND_API_KEY?: string;
  ALERT_EMAIL_TO?: string;
  ALERT_EMAIL_FROM?: string;
};

function loadAppleRootCertificate(): Buffer {
  const candidates = [
    join(process.cwd(), "certs", "AppleRootCA-G3.cer"),
    join(moduleDir, "..", "..", "certs", "AppleRootCA-G3.cer"),
    join(moduleDir, "certs", "AppleRootCA-G3.cer"),
  ];

  for (const path of candidates) {
    try {
      return readFileSync(path);
    } catch {
      // try next
    }
  }

  throw new Error("Apple Root CA G3 certificate not found");
}

function createVerifier(environment: Environment): SignedDataVerifier {
  const rootCA = loadAppleRootCertificate();
  return new SignedDataVerifier(
    [rootCA],
    false,
    environment,
    BUNDLE_ID,
    APP_APPLE_ID
  );
}

async function verifyNotification(signedPayload: string) {
  const productionVerifier = createVerifier(Environment.PRODUCTION);
  try {
    return {
      environment: Environment.PRODUCTION,
      payload: await productionVerifier.verifyAndDecodeNotification(signedPayload),
    };
  } catch {
    const sandboxVerifier = createVerifier(Environment.SANDBOX);
    return {
      environment: Environment.SANDBOX,
      payload: await sandboxVerifier.verifyAndDecodeNotification(signedPayload),
    };
  }
}

function notificationLabel(type: string, subtype?: string): string {
  switch (type) {
    case NotificationTypeV2.ONE_TIME_CHARGE:
      return "Nouvel achat Premium";
    case NotificationTypeV2.REFUND:
      return "Remboursement Premium";
    case NotificationTypeV2.REVOKE:
      return "Révocation Premium";
    case NotificationTypeV2.TEST:
      return "Notification de test Apple";
    default:
      return subtype ? `${type} / ${subtype}` : type;
  }
}

async function sendNtfy(env: AlertEnv, title: string, message: string): Promise<void> {
  if (!env.NTFY_TOPIC) return;

  const headers: Record<string, string> = {
    Title: title,
    Priority: "high",
    Tags: "apple,moneybag",
  };
  if (env.NTFY_TOKEN) {
    headers.Authorization = `Bearer ${env.NTFY_TOKEN}`;
  }

  const response = await fetch(`https://ntfy.sh/${env.NTFY_TOPIC}`, {
    method: "POST",
    headers,
    body: message,
  });

  if (!response.ok) {
    console.error("ntfy error", response.status, await response.text());
  }
}

async function sendEmail(env: AlertEnv, title: string, message: string): Promise<void> {
  if (!env.RESEND_API_KEY || !env.ALERT_EMAIL_TO) return;

  const from = env.ALERT_EMAIL_FROM ?? "Rappel Produit <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [env.ALERT_EMAIL_TO],
      subject: `[Rappel Produit] ${title}`,
      text: message,
    }),
  });

  if (!response.ok) {
    console.error("Resend error", response.status, await response.text());
  }
}

async function notifyDeveloper(
  env: AlertEnv,
  title: string,
  details: Record<string, string | undefined>
): Promise<void> {
  const message = Object.entries(details)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  await Promise.all([
    sendNtfy(env, title, message),
    sendEmail(env, title, message),
  ]);
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body ?? "{}") as { signedPayload?: string };
    if (!body.signedPayload) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing signedPayload" }),
      };
    }

    const { environment, payload } = await verifyNotification(body.signedPayload);
    const type = payload.notificationType ?? "UNKNOWN";
    const subtype = payload.subtype;
    const title = notificationLabel(type, subtype);

    let productId: string | undefined;
    let transactionId: string | undefined;
    let purchaseDate: string | undefined;

    if (payload.data?.signedTransactionInfo) {
      const verifier = createVerifier(environment);
      const transaction = await verifier.verifyAndDecodeTransaction(
        payload.data.signedTransactionInfo
      );
      productId = transaction.productId;
      transactionId = transaction.transactionId;
      purchaseDate = transaction.purchaseDate
        ? new Date(transaction.purchaseDate).toISOString()
        : undefined;
    }

    if (productId && productId !== PREMIUM_PRODUCT_ID && type !== NotificationTypeV2.TEST) {
      console.log("Ignored product", productId, type);
      return { statusCode: 200, body: JSON.stringify({ ok: true, ignored: true }) };
    }

    const env: AlertEnv = {
      NTFY_TOPIC: process.env.NTFY_TOPIC,
      NTFY_TOKEN: process.env.NTFY_TOKEN,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      ALERT_EMAIL_TO: process.env.ALERT_EMAIL_TO,
      ALERT_EMAIL_FROM: process.env.ALERT_EMAIL_FROM,
    };

    await notifyDeveloper(env, title, {
      Environnement: environment,
      Type: type,
      SousType: subtype,
      Produit: productId,
      Transaction: transactionId,
      Date: purchaseDate,
      Bundle: payload.data?.bundleId,
      UUID: payload.notificationUUID,
    });

    console.log("ASN handled", { type, subtype, environment, productId });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.error("ASN verification failed", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid notification" }),
    };
  }
};
