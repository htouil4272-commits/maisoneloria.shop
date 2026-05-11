# 🚀 MAISON ELORIA — Launch Checklist

> Tout est prêt. Voici les commandes/valeurs à utiliser dans l'ordre.

---

## 📦 Packages générés

| Fichier | Taille | Pour |
|---|---|---|
| `maisoneloria-frontend.zip` | 81 KB | Cloudflare Pages / cPanel |
| `maisoneloria-backend.zip` | 24 KB | EasyPanel (uploadez ou poussez sur Git) |

---

## 🔐 Credentials générés (NE PAS PARTAGER)

```
ADMIN_PASSWORD = QTReLG4bmGFYUhlKYPb8RPQwewcs
DB_PASSWORD    = TzMLLTcIUgCHBhpVuXVwcWIL
```

> **Action immédiate** : sauvegardez ces deux mots de passe dans votre gestionnaire (Bitwarden, 1Password, ou même une note privée sur votre téléphone). Ils ne seront PAS régénérés.

---

## ✅ Tests locaux passés

| Test | Résultat |
|---|---|
| Syntaxe Backend (10 fichiers) | ✅ OK |
| Syntaxe Frontend (9 modules) | ✅ OK |
| Dev server : 15 URLs HTTP | ✅ 14×200 + 1×404 |
| Page 404.html servie | ✅ 6143 octets |
| sitemap.xml accessible | ✅ |
| robots.txt accessible | ✅ |
| manifest.json (PWA) | ✅ |
| favicon.svg | ✅ |
| products.json | ✅ |

---

## 🟢 STEP 1 — Mettre VOTRE numéro WhatsApp

Ouvrez `site/assets/data/products.json` ligne ~10 :

```diff
- "whatsapp": "212600000000",
+ "whatsapp": "212661234567",
```

> Format : indicatif `212` + numéro sans le `0` initial, sans espace, sans `+`.
> Ex : `+212 6 61 23 45 67` → `212661234567`

⚠️ **Si vous oubliez ça, toutes les commandes seront perdues.**

Après modification, refaites le ZIP frontend :
```powershell
Compress-Archive -Path "site\*" -DestinationPath "maisoneloria-frontend.zip" -Force
```

---

## 🌐 STEP 2 — Déployer le Frontend (Cloudflare Pages)

1. Allez sur https://pages.cloudflare.com
2. Connectez-vous (compte gratuit suffit)
3. **Create a project → Direct Upload**
4. Project name : `maisoneloria`
5. Glissez `maisoneloria-frontend.zip` (ou décompressez et glissez le contenu)
6. **Save and Deploy** → vous obtenez `maisoneloria.pages.dev`
7. **Custom domains** → ajoutez `maisoneloria.shop` ET `www.maisoneloria.shop`
8. Cloudflare vous donne 2 entrées DNS → mettez-les chez votre registrar

✅ **Frontend en ligne.** Test : https://maisoneloria.shop

---

## 🔧 STEP 3 — Déployer le Backend (EasyPanel)

### 3a. Service PostgreSQL

```
EasyPanel → + New → Database → PostgreSQL
  Service name : maisoneloria-db
  Database     : maisoneloria
  Username     : eloria
  Password     : TzMLLTcIUgCHBhpVuXVwcWIL    ← collez celui généré ci-dessus
→ Create
```

Notez l'URL interne (visible dans l'onglet "Connection") :
```
postgres://eloria:TzMLLTcIUgCHBhpVuXVwcWIL@maisoneloria-db:5432/maisoneloria
```

### 3b. Service App

**Option A — Upload ZIP (le plus simple) :**

EasyPanel ne supporte pas l'upload ZIP directement. Vous avez deux choix :

**Option B — Git (recommandé)** :

1. Créez un repo privé `maisoneloria-api` sur GitHub
2. Upload manuel : sur la page repo → "uploading an existing file" → glissez le contenu de `maisoneloria-backend.zip` (décompressé)
3. Commit message : `initial`

**Option C — EasyPanel Dockerfile direct** :

Dans EasyPanel, créez l'app et collez le contenu du Dockerfile manuellement.

### 3c. Créer l'App

```
EasyPanel → + New → App
  Service name : maisoneloria-api
  Source       : Git (URL du repo créé en 3b)
  Branch       : main
  Build        : Dockerfile (path: /Dockerfile)
  Domains      : api.maisoneloria.shop  + Auto SSL ✓
  Environment  :
    NODE_ENV=production
    PORT=3000
    DATABASE_URL=postgres://eloria:TzMLLTcIUgCHBhpVuXVwcWIL@maisoneloria-db:5432/maisoneloria
    ADMIN_USER=admin
    ADMIN_PASSWORD=QTReLG4bmGFYUhlKYPb8RPQwewcs
    ALLOWED_ORIGINS=https://maisoneloria.shop,https://www.maisoneloria.shop
    SERVE_STATIC=false
→ Deploy
```

---

## 🌍 STEP 4 — DNS

Chez votre registrar de domaine :

| Type  | Name | Valeur                              |
|-------|------|-------------------------------------|
| CNAME | `@`  | (donné par Cloudflare en STEP 2)    |
| CNAME | `www`| (donné par Cloudflare en STEP 2)    |
| A     | `api`| IP de votre serveur EasyPanel       |

⏳ Attendez 5-30 min de propagation.

---

## 🧪 STEP 5 — Vérifications

```bash
# Frontend
curl -I https://maisoneloria.shop                   # → 200

# Backend health
curl https://api.maisoneloria.shop/api/healthz      # → {"ok":true,"ts":"..."}

# Admin panel (avec navigateur)
https://api.maisoneloria.shop/admin/
  Login : admin
  Pass  : QTReLG4bmGFYUhlKYPb8RPQwewcs
```

---

## ⭐ Bonus — Notifications Telegram (5 min)

Sur Telegram :
1. `@BotFather` → `/newbot` → suivez les instructions, notez le `TOKEN`
2. Ouvrez votre bot, envoyez `/start`, puis visitez :
   `https://api.telegram.org/bot<TOKEN>/getUpdates` → notez `chat.id`
3. Dans EasyPanel → maisoneloria-api → Environment, ajoutez :
   ```
   TELEGRAM_BOT_TOKEN=123456:AAA...
   TELEGRAM_CHAT_ID=987654321
   ```
4. Redeploy

---

## ⭐ Bonus — Confirmations Email (5 min, Brevo gratuit)

1. Inscrivez-vous sur https://brevo.com (300 emails/jour gratuits)
2. **SMTP & API** → SMTP → notez login + key
3. Dans EasyPanel → maisoneloria-api → Environment :
   ```
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=<your-brevo-login@smtp-brevo.com>
   SMTP_PASS=<your-brevo-key>
   SMTP_FROM=Maison Eloria <contact@maisoneloria.shop>
   ```
4. Redeploy

---

## 🎯 Premier test bout-en-bout

1. Visitez https://maisoneloria.shop
2. Cliquez "Voir la collection" → choisissez "Housse de Chaise"
3. Sélectionnez une couleur, ajoutez au panier
4. Cliquez "Commander" → remplissez avec **VOTRE** téléphone test
5. → vous recevez le message WhatsApp
6. → la commande apparaît dans https://api.maisoneloria.shop/admin/
7. → si Telegram configuré, vous recevez une notification
8. → si email configuré, vous recevez une confirmation HTML

✅ **Si tout marche : le site est officiellement LIVE.**

---

## 🆘 Si ça ne marche pas

| Problème | Solution |
|---|---|
| Frontend OK mais panier vide après ajout | Cache navigateur — Ctrl+F5 |
| `/api/orders` renvoie CORS error | Vérifiez `ALLOWED_ORIGINS` dans EasyPanel |
| Admin panel demande pas le password | `ADMIN_PASSWORD` non défini → routes désactivées (sécurité) |
| `502 Bad Gateway` sur api.maisoneloria.shop | Backend pas encore démarré ou crashé — voir logs EasyPanel |
| WhatsApp link vide | `whatsapp` dans `products.json` non modifié |
| `track.html` dit "not_found" | Le numéro de commande n'existe pas (pas encore créé) |

---

**Bonne chance pour le launch ! 🌹**
