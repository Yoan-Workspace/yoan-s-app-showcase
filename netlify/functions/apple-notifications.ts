import type { Handler, HandlerEvent } from "@netlify/functions";
import {
  Environment,
  NotificationTypeV2,
  SignedDataVerifier,
} from "@apple/app-store-server-library";

type AppConfig = {
  name: string;
  bundleId: string;
  appAppleId: number;
  productIds: ReadonlySet<string>;
};

const APPS: readonly AppConfig[] = [
  {
    name: "Rappel Produit",
    bundleId: "com.yoansoussand.Rappel-Produit",
    appAppleId: 6449599235,
    productIds: new Set(["com.yoansoussand.rappelproduit.premium"]),
  },
  {
    name: "AllFaves",
    bundleId: "com.yoansoussand.AllFaves",
    appAppleId: 6760546463,
    productIds: new Set([
      "com.yoansoussand.allfaves.premium",
      "com.yoansoussand.allfaves.premium.monthly",
      "com.yoansoussand.allfaves.premium.annual",
    ]),
  },
  {
    name: "Convert Scanner to PDF",
    bundleId: "com.yoansoussand.PhotoToPDF",
    appAppleId: 6478161902,
    productIds: new Set([
      "com.phototopdf.removeads.lifetime",
      "com.yoansoussand.phototopdf.MonthlySubscribe",
      "com.yoansoussand.phototopdf.AnnuallySubscribe",
    ]),
  },
];

// Apple Root CA G3 — embarqué pour éviter import.meta.url / chemins fichiers
// cassés après le bundling CJS de Netlify Functions.
// Source publique : https://www.apple.com/certificateauthority/AppleRootCA-G3.cer
const APPLE_ROOT_CA_G3_BASE64 =
  "MIICQzCCAcmgAwIBAgIILcX8iNLFS5UwCgYIKoZIzj0EAwMwZzEbMBkGA1UEAwwSQXBwbGUgUm9vdCBDQSAtIEczMSYwJAYDVQQLDB1BcHBsZSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTETMBEGA1UECgwKQXBwbGUgSW5jLjELMAkGA1UEBhMCVVMwHhcNMTQwNDMwMTgxOTA2WhcNMzkwNDMwMTgxOTA2WjBnMRswGQYDVQQDDBJBcHBsZSBSb290IENBIC0gRzMxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRMwEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzB2MBAGByqGSM49AgEGBSuBBAAiA2IABJjpLz1AcqTtkyJygRMc3RCV8cWjTnHcFBbZDuWmBSp3ZHtfTjjTuxxEtX/1H7YyYl3J6YRbTzBPEVoA/VhYDKX1DyxNB0cTddqXl5dvMVztK517IDvYuVTZXpmkOlEKMaNCMEAwHQYDVR0OBBYEFLuw3qFYM4iapIqZ3r6966/ayySrMA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMDA2gAMGUCMQCD6cHEFl4aXTQY2e3v9GwOAEZLuN+yRhHFD/3meoyhpmvOwgPUnPWTxnS4at+qIxUCMG1mihDK1A3UT82NQz60imOlM27jbdoXt2QfyFMm+YhidDkLF1vLUagM6BgD56KyKA==";

type AlertEnv = {
  NTFY_TOPIC?: string;
  NTFY_TOKEN?: string;
  RESEND_API_KEY?: string;
  ALERT_EMAIL_TO?: string;
  ALERT_EMAIL_FROM?: string;
};

function loadAppleRootCertificate(): Buffer {
  return Buffer.from(APPLE_ROOT_CA_G3_BASE64, "base64");
}

function createVerifier(app: AppConfig, environment: Environment): SignedDataVerifier {
  const rootCA = loadAppleRootCertificate();
  return new SignedDataVerifier(
    [rootCA],
    false,
    environment,
    app.bundleId,
    app.appAppleId
  );
}

async function verifyNotification(signedPayload: string) {
  let lastError: unknown;

  for (const app of APPS) {
    for (const environment of [Environment.PRODUCTION, Environment.SANDBOX]) {
      try {
        const verifier = createVerifier(app, environment);
        const payload = await verifier.verifyAndDecodeNotification(signedPayload);
        return { app, environment, payload, verifier };
      } catch (error) {
        lastError = error;
      }
    }
  }

  throw lastError ?? new Error("Unable to verify notification for any known app");
}

function productLabel(productId?: string): string | undefined {
  if (!productId) return undefined;
  if (productId.includes("lifetime") || productId.includes("removeads")) {
    return `${productId} (à vie)`;
  }
  if (productId.endsWith(".monthly") || productId.includes("MonthlySubscribe")) {
    return `${productId} (mensuel)`;
  }
  if (productId.endsWith(".annual") || productId.includes("AnnuallySubscribe")) {
    return `${productId} (annuel)`;
  }
  if (productId.endsWith(".premium")) return `${productId} (achat unique)`;
  return productId;
}

function notificationLabel(type: string, subtype?: string): string {
  switch (type) {
    case NotificationTypeV2.ONE_TIME_CHARGE:
      return "Nouvel achat Premium";
    case NotificationTypeV2.SUBSCRIBED:
      return "Nouvel abonnement Premium";
    case NotificationTypeV2.DID_RENEW:
      return "Renouvellement Premium";
    case NotificationTypeV2.DID_FAIL_TO_RENEW:
      return "Échec de renouvellement Premium";
    case NotificationTypeV2.EXPIRED:
      return "Abonnement Premium expiré";
    case NotificationTypeV2.GRACE_PERIOD_EXPIRED:
      return "Période de grâce Premium expirée";
    case NotificationTypeV2.DID_CHANGE_RENEWAL_STATUS:
      return subtype === "AUTO_RENEW_DISABLED"
        ? "Renouvellement auto désactivé"
        : subtype === "AUTO_RENEW_ENABLED"
          ? "Renouvellement auto activé"
          : "Changement de renouvellement";
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

async function sendEmail(
  env: AlertEnv,
  appName: string,
  title: string,
  message: string
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.ALERT_EMAIL_TO) return;

  const from = env.ALERT_EMAIL_FROM ?? `${appName} <onboarding@resend.dev>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [env.ALERT_EMAIL_TO],
      subject: `[${appName}] ${title}`,
      text: message,
    }),
  });

  if (!response.ok) {
    console.error("Resend error", response.status, await response.text());
  }
}

async function notifyDeveloper(
  env: AlertEnv,
  appName: string,
  title: string,
  details: Record<string, string | undefined>
): Promise<void> {
  const message = Object.entries(details)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const alertTitle = `${appName} — ${title}`;

  await Promise.all([
    sendNtfy(env, alertTitle, message),
    sendEmail(env, appName, title, message),
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

    const { app, environment, payload, verifier } = await verifyNotification(
      body.signedPayload
    );
    const type = payload.notificationType ?? "UNKNOWN";
    const subtype = payload.subtype;
    const title = notificationLabel(type, subtype);

    let productId: string | undefined;
    let transactionId: string | undefined;
    let purchaseDate: string | undefined;

    if (payload.data?.signedTransactionInfo) {
      const transaction = await verifier.verifyAndDecodeTransaction(
        payload.data.signedTransactionInfo
      );
      productId = transaction.productId;
      transactionId = transaction.transactionId;
      purchaseDate = transaction.purchaseDate
        ? new Date(transaction.purchaseDate).toISOString()
        : undefined;
    }

    if (
      productId &&
      !app.productIds.has(productId) &&
      type !== NotificationTypeV2.TEST
    ) {
      console.log("Ignored product", { app: app.name, productId, type });
      return { statusCode: 200, body: JSON.stringify({ ok: true, ignored: true }) };
    }

    const env: AlertEnv = {
      NTFY_TOPIC: process.env.NTFY_TOPIC,
      NTFY_TOKEN: process.env.NTFY_TOKEN,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      ALERT_EMAIL_TO: process.env.ALERT_EMAIL_TO,
      ALERT_EMAIL_FROM: process.env.ALERT_EMAIL_FROM,
    };

    await notifyDeveloper(env, app.name, title, {
      App: app.name,
      Environnement: environment,
      Type: type,
      SousType: subtype,
      Produit: productLabel(productId),
      Transaction: transactionId,
      Date: purchaseDate,
      Bundle: payload.data?.bundleId ?? app.bundleId,
      UUID: payload.notificationUUID,
    });

    console.log("ASN handled", {
      app: app.name,
      type,
      subtype,
      environment,
      productId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, app: app.name }),
    };
  } catch (error) {
    console.error("ASN verification failed", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid notification" }),
    };
  }
};
