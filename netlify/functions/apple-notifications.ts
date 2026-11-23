import { X509Certificate } from "node:crypto";
import type { Handler, HandlerEvent } from "@netlify/functions";
import jwt from "jsonwebtoken";

type AppConfig = {
  name: string;
  bundleId: string;
  productIds: ReadonlySet<string>;
};

type NotificationPayload = {
  notificationType?: string;
  subtype?: string;
  notificationUUID?: string;
  data?: {
    bundleId?: string;
    environment?: string;
    signedTransactionInfo?: string;
  };
};

type TransactionPayload = {
  productId?: string;
  transactionId?: string;
  purchaseDate?: number;
  bundleId?: string;
  environment?: string;
};

const APPS: readonly AppConfig[] = [
  {
    name: "Rappel Produit",
    bundleId: "com.yoansoussand.Rappel-Produit",
    productIds: new Set(["com.yoansoussand.rappelproduit.premium"]),
  },
  {
    name: "AllFaves",
    bundleId: "com.yoansoussand.AllFaves",
    productIds: new Set([
      "com.yoansoussand.allfaves.premium",
      "com.yoansoussand.allfaves.premium.monthly",
      "com.yoansoussand.allfaves.premium.annual",
    ]),
  },
  {
    name: "Convert Scanner to PDF",
    bundleId: "com.yoansoussand.PhotoToPDF",
    productIds: new Set([
      "com.phototopdf.removeads.lifetime",
      "com.yoansoussand.phototopdf.MonthlySubscribe",
      "com.yoansoussand.phototopdf.AnnuallySubscribe",
    ]),
  },
];

// Apple Root CA G3 — https://www.apple.com/certificateauthority/AppleRootCA-G3.cer
const APPLE_ROOT_CA_G3_BASE64 =
  "MIICQzCCAcmgAwIBAgIILcX8iNLFS5UwCgYIKoZIzj0EAwMwZzEbMBkGA1UEAwwSQXBwbGUgUm9vdCBDQSAtIEczMSYwJAYDVQQLDB1BcHBsZSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTETMBEGA1UECgwKQXBwbGUgSW5jLjELMAkGA1UEBhMCVVMwHhcNMTQwNDMwMTgxOTA2WhcNMzkwNDMwMTgxOTA2WjBnMRswGQYDVQQDDBJBcHBsZSBSb290IENBIC0gRzMxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRMwEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzB2MBAGByqGSM49AgEGBSuBBAAiA2IABJjpLz1AcqTtkyJygRMc3RCV8cWjTnHcFBbZDuWmBSp3ZHtfTjjTuxxEtX/1H7YyYl3J6YRbTzBPEVoA/VhYDKX1DyxNB0cTddqXl5dvMVztK517IDvYuVTZXpmkOlEKMaNCMEAwHQYDVR0OBBYEFLuw3qFYM4iapIqZ3r6966/ayySrMA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMDA2gAMGUCMQCD6cHEFl4aXTQY2e3v9GwOAEZLuN+yRhHFD/3meoyhpmvOwgPUnPWTxnS4at+qIxUCMG1mihDK1A3UT82NQz60imOlM27jbdoXt2QfyFMm+YhidDkLF1vLUagM6BgD56KyKA==";

type AlertEnv = {
  NTFY_TOPIC?: string;
  NTFY_TOKEN?: string;
  RESEND_API_KEY?: string;
  ALERT_EMAIL_TO?: string;
  ALERT_EMAIL_FROM?: string;
};

/**
 * Vérifie un JWS Apple (x5c) avec node:crypto uniquement.
 * Évite @apple/app-store-server-library + jsrsasign, cassés par le bundling Netlify.
 */
function verifyAppleJws<T extends object>(signedPayload: string): T {
  const decoded = jwt.decode(signedPayload, { complete: true });
  if (!decoded || typeof decoded === "string" || !decoded.header) {
    throw new Error("Invalid JWS");
  }

  const x5c = decoded.header.x5c;
  if (!Array.isArray(x5c) || x5c.length < 2) {
    throw new Error("Missing x5c certificate chain");
  }

  const leaf = new X509Certificate(Buffer.from(x5c[0], "base64"));
  const intermediate = new X509Certificate(Buffer.from(x5c[1], "base64"));
  const root = new X509Certificate(Buffer.from(APPLE_ROOT_CA_G3_BASE64, "base64"));

  if (!leaf.verify(intermediate.publicKey)) {
    throw new Error("Leaf certificate not signed by intermediate");
  }
  if (!intermediate.verify(root.publicKey)) {
    throw new Error("Intermediate certificate not signed by Apple Root CA G3");
  }

  const now = Date.now();
  if (new Date(leaf.validFrom).getTime() > now + 60_000) {
    throw new Error("Leaf certificate not yet valid");
  }
  if (new Date(leaf.validTo).getTime() < now - 60_000) {
    throw new Error("Leaf certificate expired");
  }

  const pem = leaf.publicKey.export({ type: "spki", format: "pem" });
  return jwt.verify(signedPayload, pem, { algorithms: ["ES256"] }) as T;
}

function resolveApp(bundleId?: string): AppConfig {
  const app = APPS.find((candidate) => candidate.bundleId === bundleId);
  if (!app) {
    throw new Error(`Unknown bundleId: ${bundleId ?? "(missing)"}`);
  }
  return app;
}

function parseRequestBody(event: HandlerEvent): { signedPayload?: string } {
  const raw = event.body ?? "{}";
  const text = event.isBase64Encoded
    ? Buffer.from(raw, "base64").toString("utf8")
    : raw;
  return JSON.parse(text) as { signedPayload?: string };
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
    case "ONE_TIME_CHARGE":
      return "Nouvel achat Premium";
    case "SUBSCRIBED":
      return "Nouvel abonnement Premium";
    case "DID_RENEW":
      return "Renouvellement Premium";
    case "DID_FAIL_TO_RENEW":
      return "Échec de renouvellement Premium";
    case "EXPIRED":
      return "Abonnement Premium expiré";
    case "GRACE_PERIOD_EXPIRED":
      return "Période de grâce Premium expirée";
    case "DID_CHANGE_RENEWAL_STATUS":
      return subtype === "AUTO_RENEW_DISABLED"
        ? "Renouvellement auto désactivé"
        : subtype === "AUTO_RENEW_ENABLED"
          ? "Renouvellement auto activé"
          : "Changement de renouvellement";
    case "REFUND":
      return "Remboursement Premium";
    case "REVOKE":
      return "Révocation Premium";
    case "TEST":
      return "Notification de test Apple";
    default:
      return subtype ? `${type} / ${subtype}` : type;
  }
}

/** Headers HTTP = Latin-1 only ; un tiret long "—" fait planter fetch. */
function toHttpHeaderValue(value: string): string {
  return value.replace(/[^\x20-\x7E]/g, "-");
}

async function sendNtfy(env: AlertEnv, title: string, message: string): Promise<void> {
  if (!env.NTFY_TOPIC) {
    console.error("NTFY_TOPIC missing - skip ntfy");
    return;
  }

  const headers: Record<string, string> = {
    Title: toHttpHeaderValue(title),
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

  const alertTitle = `${appName} - ${title}`;

  // Ne pas faire échouer la réponse Apple si ntfy/mail plante
  const results = await Promise.allSettled([
    sendNtfy(env, alertTitle, message),
    sendEmail(env, appName, title, message),
  ]);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("alert channel failed", result.reason);
    }
  }
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = parseRequestBody(event);
    if (!body.signedPayload) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing signedPayload" }),
      };
    }

    const payload = verifyAppleJws<NotificationPayload>(body.signedPayload);
    const app = resolveApp(payload.data?.bundleId);
    const environment = payload.data?.environment ?? "Unknown";
    const type = payload.notificationType ?? "UNKNOWN";
    const subtype = payload.subtype;
    const title = notificationLabel(type, subtype);

    let productId: string | undefined;
    let transactionId: string | undefined;
    let purchaseDate: string | undefined;

    if (payload.data?.signedTransactionInfo) {
      const transaction = verifyAppleJws<TransactionPayload>(
        payload.data.signedTransactionInfo
      );
      productId = transaction.productId;
      transactionId = transaction.transactionId;
      purchaseDate = transaction.purchaseDate
        ? new Date(transaction.purchaseDate).toISOString()
        : undefined;
    }

    if (productId && !app.productIds.has(productId) && type !== "TEST") {
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
      ntfyConfigured: Boolean(env.NTFY_TOPIC),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, app: app.name }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("ASN verification failed", message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid notification", detail: message }),
    };
  }
};
