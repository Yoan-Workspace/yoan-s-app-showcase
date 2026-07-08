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

## Licence

© Yoan Soussand. Tous droits réservés.
