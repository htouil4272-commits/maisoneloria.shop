# 🌹 MAISON ELORIA — Site Web Officiel

> **L'art de vivre marocain** · فنّ الحياة المغربية
> Site e-commerce statique, multilingue (FR/AR), optimisé pour COD au Maroc.

---

## 📦 Ce qui est inclus

### Pages
- **`index.html`** — Page d'accueil (Hero, Before/After, 9 couleurs, packs, témoignages, FAQ)
- **`shop.html`** — Boutique avec filtres par catégorie et couleur
- **`product.html`** — Détail produit avec sélection de couleur, taille, pack
- **`checkout.html`** — Tunnel de commande → WhatsApp
- **`about.html`** — Notre histoire
- **`contact.html`** — Page de contact (WhatsApp, email, formulaire)

### Fonctionnalités
- ✅ **Bilingue FR/AR** avec RTL automatique
- ✅ **Panier** persistant (localStorage)
- ✅ **Checkout double-canal** : envoi à l'API backend + redirection WhatsApp (graceful fallback si l'API est indisponible)
- ✅ **Newsletter & Contact** branchés à l'API backend (avec fallback)
- ✅ **9 couleurs** marocaines avec dégradés réalistes
- ✅ **3 produits** : housses chaise, chemins table, coussins
- ✅ **4 packs** : Découverte, Famille, Salon Complet, Diplomatique
- ✅ **Section Manifesto** (positioning vs imports) + **Trio de catégories**
- ✅ **Logo Lockup** : N-mark + maisoneloria + ON AIR (avec dot pulsant)
- ✅ **Mobile-first** & RTL-aware
- ✅ **SEO** : meta tags, Open Graph, Schema.org Store
- ✅ **WhatsApp floating button** sur chaque page
- ✅ **Aucune dépendance** : HTML + CSS + JS pur

### Backend (dossier `../backend/`)
- ✅ **Node.js + Fastify + PostgreSQL** prêt pour EasyPanel
- ✅ **Admin panel** sécurisé (Basic Auth) sur `/admin/`
- ✅ Endpoints : `/api/orders`, `/api/newsletter`, `/api/contact`, `/api/admin/*`
- ✅ Notifications Telegram (optionnel)
- ✅ Voir `backend/README.md` pour le déploiement

### Technologies
- HTML5 + CSS3 (custom design system, ~50KB)
- Vanilla JavaScript (ES Modules)
- Google Fonts : Cormorant Garamond + Inter + Tajawal
- Aucun build step requis !

---

## ⚙️ Configuration avant déploiement

### 1. Numéro WhatsApp (CRITIQUE !)

Ouvrez `assets/data/products.json` et remplacez `212600000000` par votre vrai numéro :

```json
"brand": {
  "whatsapp": "212XXXXXXXXX"
}
```

> ⚠️ Format : code pays sans `+` ni espaces. Exemple : `212661234567` pour `+212 6 61 23 45 67`.

### 2. Email & Réseaux sociaux

Dans le même fichier JSON :
```json
"email": "contact@maisoneloria.shop",
"instagram": "maisoneloria",
"tiktok": "maisoneloria",
"facebook": "maisoneloria"
```

### 3. Tracking Pixels (optionnel — à ajouter avant launch)

Dans chaque `*.html`, juste avant `</head>`, ajoutez :

**Facebook Pixel** :
```html
<script>
!function(f,b,e,v,n,t,s){...}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'VOTRE_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

**TikTok Pixel** : idem dans le `<head>`.

**Google Analytics 4** :
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

---

## 🚀 Déploiement

### Option A : Hébergement classique (cPanel / FTP) — Le plus probable

1. Connectez-vous à votre cPanel ou FTP (FileZilla recommandé)
2. Naviguez vers le dossier `public_html/` (ou `www/`)
3. **Uploadez tout le contenu du dossier `site/`** (pas le dossier lui-même !)
4. Vérifiez que `index.html` est à la racine de `public_html/`
5. Visitez `https://maisoneloria.shop/` — c'est en ligne ! 🎉

**Structure attendue sur le serveur :**
```
public_html/
├── index.html
├── shop.html
├── product.html
├── checkout.html
├── about.html
├── contact.html
└── assets/
    ├── css/
    ├── js/
    ├── data/
    ├── images/
    └── fonts/
```

### Option B : Cloudflare Pages (recommandé — GRATUIT + ULTRA RAPIDE)

1. Créez un compte sur [pages.cloudflare.com](https://pages.cloudflare.com)
2. **"Upload assets"** → glissez-déposez le dossier `site/`
3. Connectez votre domaine `maisoneloria.shop` (Cloudflare Domains)
4. **SSL automatique + CDN mondial inclus**

> 💡 **Avantage** : Cloudflare Pages est plus rapide que la majorité des hébergements payants au Maroc, et c'est gratuit.

### Option C : Netlify / Vercel

1. Créez un compte sur [netlify.com](https://netlify.com) ou [vercel.com](https://vercel.com)
2. Glissez-déposez `site/` dans la zone d'upload
3. Connectez votre domaine

---

## 🧪 Test en local

Pour tester le site avant déploiement :

### Avec Python (déjà installé sur Windows 10/11) :
```powershell
cd site
python -m http.server 8000
# Ouvrez http://localhost:8000 dans votre navigateur
```

### Avec Node.js :
```powershell
cd site
npx serve
# Ouvrez l'URL affichée
```

### Avec extension VS Code :
- Installez **"Live Server"** dans VS Code
- Clic droit sur `index.html` → **"Open with Live Server"**

> ⚠️ **Important** : Vous DEVEZ utiliser un serveur local (pas `file://`) car le site charge `products.json` via fetch.

---

## ✏️ Comment modifier le contenu

### Changer un prix
Ouvrez `assets/data/products.json` → trouvez le produit → modifiez `pricing`.

### Ajouter une couleur
Ouvrez `assets/data/products.json` → ajoutez un objet dans le tableau `colors` :
```json
{
  "id": "votre-id",
  "name": { "fr": "Votre Nom FR", "ar": "اسمكِ بالعربية" },
  "originalName": "Couleur",
  "inspiration": { "fr": "...", "ar": "..." },
  "hex": "#XXXXXX",
  "gradient": "linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%)"
}
```

### Modifier les textes
- **Textes statiques** (FR/AR) : `assets/js/i18n.js`
- **Textes des produits** : `assets/data/products.json`

### Changer les couleurs de la marque
Ouvrez `assets/css/styles.css` → section `:root` (ligne ~20) :
```css
--color-terracotta: #C97B5C; /* Couleur principale */
--color-cream: #F5EDE0;       /* Fond doux */
--color-charcoal: #2A2520;    /* Texte */
```

---

## 📸 Photos des produits (à ajouter)

Actuellement, les "produits" sont représentés par des **dégradés de couleur** (placeholder esthétique). Pour ajouter les vraies photos :

1. Créez 9 photos (une par couleur), idéalement 800×1000px, format WebP ou JPG
2. Placez-les dans `assets/images/colors/`
3. Nommage : `{color-id}.webp` (ex: `cedre-atlas.webp`)
4. Modifiez `assets/js/main.js` et `shop.js` pour utiliser `<img>` au lieu de `<div style="background:...">`

> **Conseil** : Commencez par lancer le site avec les dégradés. Ils sont déjà élégants et professionnels. Ajoutez les vraies photos au fur et à mesure que vous les avez.

---

## 🎯 Prochaines étapes recommandées

### Phase 1 — Lancement immédiat (aujourd'hui)
- [ ] Remplacer le numéro WhatsApp dans `products.json`
- [ ] Uploader `site/` sur votre serveur
- [ ] Tester un parcours complet (accueil → produit → panier → checkout → WhatsApp)

### Phase 2 — Première semaine
- [ ] Ajouter les vraies photos de produits
- [ ] Installer Facebook Pixel + TikTok Pixel
- [ ] Lier votre Instagram/TikTok aux liens du footer
- [ ] Créer 5 vraies fiches produits avec descriptions personnalisées

### Phase 3 — Premier mois
- [ ] Ajouter de vrais témoignages clients (remplacer les placeholders dans `products.json`)
- [ ] Créer un blog (ajouter `blog.html`) pour le SEO
- [ ] Implémenter Mailchimp pour le formulaire newsletter
- [ ] Ajouter Google Analytics 4

### Phase 4 — Plus tard (optionnel)
- [ ] Migrer vers Shopify si > 50 commandes/jour (gestion stock automatique)
- [ ] Ajouter un système d'avis (Loox via Shopify)
- [ ] Système de réduction codes (`PROMO10`)

---

## 🆘 Problèmes courants

### "Les produits ne s'affichent pas"
→ Vous ouvrez le site avec `file://`. Utilisez un serveur local (voir section Test).

### "Le bouton WhatsApp ne marche pas"
→ Vérifiez que le numéro dans `products.json` est correct (format `212XXXXXXXXX` sans `+`).

### "Les polices arabes ne se chargent pas"
→ Internet bloqué ? Les polices viennent de Google Fonts. Vérifiez votre connexion.

### "Le site est lent"
→ Activez Cloudflare ou utilisez Cloudflare Pages.

---

## 📞 Architecture du code

```
site/
├── *.html                  → Pages statiques
└── assets/
    ├── css/styles.css      → Design system complet (~50KB)
    ├── js/
    │   ├── i18n.js         → Traductions FR/AR + switcher
    │   ├── cart.js         → Panier + génération message WhatsApp
    │   ├── main.js         → Homepage + cart drawer + helpers
    │   ├── shop.js         → Page boutique (filtres)
    │   ├── product.js      → Page détail produit
    │   └── checkout.js     → Formulaire checkout → WhatsApp
    ├── data/
    │   └── products.json   → Toutes les données (couleurs, produits, testimonials, FAQ)
    ├── images/             → Photos (à ajouter)
    └── fonts/              → Polices locales (optionnel)
```

---

## 💡 Pourquoi cette architecture ?

| Choix | Raison |
|---|---|
| **Pas de build step** | Édition directe, pas de toolchain à maintenir |
| **JSON pour les données** | Édition facile pour quelqu'un de non-technique |
| **localStorage pour le panier** | Pas besoin de backend, panier persiste |
| **WhatsApp pour checkout** | Aligné avec l'écosystème COD marocain |
| **Vanilla JS** | < 10KB de JS total, ultra rapide |
| **CSS custom (pas Tailwind)** | Esthétique premium, contrôle total, pas de 3MB de framework |

---

## 🌹 Made with ❤️ in Morocco

**Maison Eloria** · maisoneloria.shop · 2026
