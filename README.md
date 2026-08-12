# Yoan Soussand — Portfolio

Site vitrine bilingue (FR/EN) présentant mes applications iOS publiées sur l'App Store et mes réalisations web.

**Production :** https://yoanfreelancedev.netlify.app

## Stack technique

- **Vite** — build et dev server
- **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix UI)
- **react-router-dom** — routing SPA
- **react-i18next** — internationalisation FR/EN
- **framer-motion** — animations

## Développement

Prérequis : Node.js 18+ et npm.

```sh
# Installer les dépendances
npm install

# Lancer le serveur de développement (http://localhost:8080)
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Lancer les tests unitaires
npm test

# Linter
npm run lint
```

## Structure

```
public/            # robots.txt, sitemap.xml, favicon, redirects Netlify
src/
  assets/          # images (icônes apps, captures de sites, logo)
  components/      # composants réutilisables (Header, Footer, cartes, Seo…)
  components/ui/   # primitives shadcn/ui
  data/            # données statiques des applications
  i18n/            # fichiers de traduction fr.json / en.json + init
  pages/           # pages (Accueil, Détail app, Confidentialité, CGU, 404)
```

## Déploiement

Hébergé sur Netlify. Le fichier `public/_redirects` gère le fallback SPA vers `index.html`.

Configuration dans `netlify.toml` : build Vite → `dist`, plus les Netlify Functions.

### App Store Server Notifications (Rappel Produit, AllFaves & PhotoToPDF)

Endpoint serveur pour recevoir les alertes Apple quand un utilisateur achète le Premium. Aucune modification des apps iOS. L'endpoint reconnaît automatiquement l'app via le bundle ID.

**Apps supportées :**

| App | Bundle ID | Produits |
|-----|-----------|----------|
| Rappel Produit | `com.yoansoussand.Rappel-Produit` | achat unique Premium |
| AllFaves | `com.yoansoussand.AllFaves` | Premium mensuel / annuel (+ legacy achat unique) |
| Convert Scanner to PDF | `com.yoansoussand.PhotoToPDF` | Premium à vie, mensuel, annuel |

**URL de production :**

```
https://yoanfreelancedev.netlify.app/.netlify/functions/apple-notifications
```

Configurer cette URL dans App Store Connect → chaque app → App Store Server Notifications (V2), production et sandbox.

**Variables d'environnement Netlify :**

| Variable | Description |
|----------|-------------|
| `NTFY_TOPIC` | Topic ntfy pour les alertes push (recommandé) |
| `NTFY_TOKEN` | Optionnel, si topic privé |
| `RESEND_API_KEY` | Optionnel, alertes e-mail via Resend |
| `ALERT_EMAIL_TO` | E-mail de destination |
| `ALERT_EMAIL_FROM` | E-mail source (si Resend) |

Test local : `netlify dev` (CLI globale : `npm i -g netlify-cli`) puis envoyer une notification test depuis App Store Connect.

## Licence

© Yoan Soussand. Tous droits réservés.
