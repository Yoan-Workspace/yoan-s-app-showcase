/**
 * Envoie une notification de test App Store Server Notifications (V2)
 * vers l'URL configurée dans App Store Connect.
 *
 * Prérequis :
 * 1. Clé In-App Purchase (.p8) dans App Store Connect
 *    → Utilisateurs et accès → Intégrations → In-App Purchase
 * 2. URL ASN V2 renseignée (prod et/ou sandbox) pour l'app
 * 3. Fichier .env.apple rempli (voir .env.apple.example)
 *
 * Usage :
 *   npm run test:apple-asn
 *   npm run test:apple-asn -- --app allfaves
 *   npm run test:apple-asn -- --app phototopdf --production
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AppStoreServerAPIClient,
  Environment,
} from "@apple/app-store-server-library";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const APPS = {
  allfaves: "com.yoansoussand.AllFaves",
  rappel: "com.yoansoussand.Rappel-Produit",
  phototopdf: "com.yoansoussand.PhotoToPDF",
};

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const args = { app: "allfaves", production: false, status: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--production" || a === "--prod") args.production = true;
    else if (a === "--app") args.app = (argv[++i] || "").toLowerCase();
    else if (a === "--status") args.status = argv[++i];
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Usage:
  npm run test:apple-asn
  npm run test:apple-asn -- --app allfaves|rappel|phototopdf
  npm run test:apple-asn -- --app allfaves --production
  npm run test:apple-asn -- --status <testNotificationToken>

Apps:
  allfaves   → ${APPS.allfaves}
  rappel     → ${APPS.rappel}
  phototopdf → ${APPS.phototopdf}
`);
}

loadEnvFile(resolve(root, ".env.apple"));

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}

const keyId = process.env.APPLE_IAP_KEY_ID;
const issuerId = process.env.APPLE_IAP_ISSUER_ID;
const keyPath = process.env.APPLE_IAP_KEY_PATH;
const bundleFromEnv = process.env.APPLE_BUNDLE_ID;

if (!keyId || !issuerId || !keyPath) {
  console.error(
    "Missing env. Copy .env.apple.example → .env.apple and fill APPLE_IAP_KEY_ID, APPLE_IAP_ISSUER_ID, APPLE_IAP_KEY_PATH."
  );
  process.exit(1);
}

const absoluteKeyPath = resolve(root, keyPath);
if (!existsSync(absoluteKeyPath)) {
  console.error(`Key file not found: ${absoluteKeyPath}`);
  process.exit(1);
}

const bundleId =
  bundleFromEnv ||
  APPS[args.app] ||
  (() => {
    console.error(`Unknown --app "${args.app}". Use: ${Object.keys(APPS).join(", ")}`);
    process.exit(1);
  })();

const environment = args.production ? Environment.PRODUCTION : Environment.SANDBOX;
const encodedKey = readFileSync(absoluteKeyPath, "utf8");
const client = new AppStoreServerAPIClient(
  encodedKey,
  keyId,
  issuerId,
  bundleId,
  environment
);

try {
  if (args.status) {
    const status = await client.getTestNotificationStatus(args.status);
    console.log("Test notification status:");
    console.log(JSON.stringify(status, null, 2));
    process.exit(0);
  }

  console.log(`Requesting TEST notification…`);
  console.log(`  bundle : ${bundleId}`);
  console.log(`  env    : ${args.production ? "Production" : "Sandbox"}`);

  const response = await client.requestTestNotification();
  console.log("\nOK — Apple a accepté la demande.");
  console.log(`testNotificationToken: ${response.testNotificationToken}`);
  console.log(`
Vérifie :
  1. ntfy → titre du type « … — Notification de test Apple »
  2. Netlify → Functions → apple-notifications → logs « ASN handled »

Pour le statut côté Apple (quelques secondes après) :
  npm run test:apple-asn -- --status ${response.testNotificationToken}${args.production ? " --production" : ""} --app ${args.app}
`);
} catch (error) {
  console.error("\nÉchec de l'appel Apple:");
  console.error(error);
  console.error(`
Pistes :
  - Key ID / Issuer ID / .p8 incorrects
  - Mauvaise app (bundle ID) pour cette clé
  - URL Server Notifications absente dans App Store Connect (${args.production ? "Production" : "Sandbox"})
  - Pas le rôle Admin pour la clé In-App Purchase
`);
  process.exit(1);
}
