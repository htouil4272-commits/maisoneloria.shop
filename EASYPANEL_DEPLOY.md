# Déploiement Maison Eloria sur EasyPanel

Ce guide explique comment déployer **Backend (FastAPI)** + **Frontend (Next.js + nginx)** dans EasyPanel et les connecter à la base **PostgreSQL `maisoneloria`** déjà existante.

---

## 1. Pré-requis

| Élément | État attendu |
| --- | --- |
| EasyPanel installé sur un VPS (Hetzner / OVH / etc.) | ✅ |
| Service Postgres `maisoneloria_database` créé dans EasyPanel | ✅ déjà présent |
| Code source disponible (Git ou upload) | requis |
| DNS `maisoneloria.shop` géré (Cloudflare, etc.) | requis pour rediriger vers le serveur |

---

## 2. Récupérer la chaîne de connexion Postgres

Dans EasyPanel :

1. Cliquer sur le service `maisoneloria_database`.
2. Aller dans l'onglet **« Credentials »** (ou **« Connect »**).
3. Récupérer :
   - Hostname interne (ex: `maisoneloria_maisoneloria_database`)
   - Port : `5432`
   - User : `maisoneloria`
   - Password : (généré par EasyPanel)
   - Database : `maisoneloria`

La chaîne pour FastAPI sera :

```
postgresql+asyncpg://<USER>:<PASSWORD>@<HOSTNAME_INTERNE>:5432/maisoneloria
```

> Sur EasyPanel les services d'un même projet peuvent se joindre par leur **nom interne**.

---

## 3. Déploiement du Backend (FastAPI)

### 3.1 Créer le service

EasyPanel → **+ Create app → App** → choisir **App** (Dockerfile).

- Name : `backend`
- Source : Git repo (recommandé) **ou** upload du dossier `backend/`
- Build path : `/`
- Dockerfile path : `Dockerfile`

### 3.2 Variables d'environnement

Coller dans l'onglet **Environment** (en remplaçant `<...>`) :

```env
DATABASE_URL=postgresql+asyncpg://maisoneloria:<DB_PASSWORD>@maisoneloria_database:5432/maisoneloria
ALLOWED_ORIGINS=https://maisoneloria.shop,https://www.maisoneloria.shop
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD=<strong-password-min-8-chars>
ADMIN_TOKEN_SECRET=<run: python -c "import secrets; print(secrets.token_hex(32))">
DEBUG=false
```

(Optionnel) Ajouter ensuite Google Sheets / Pixels / MaxMind si désirés (voir `backend/.env.example`).

### 3.3 Ports & Domaine

- **Internal port** : `8000`
- **Public domain** : *aucun* (le frontend joint le backend en interne)

> Pour exposer une URL publique d'API (utile pour debug ou clients tiers), ajoutez `api.maisoneloria.shop` ici. Sinon, laissez sans domaine.

### 3.4 Volume persistant (optionnel)

Pour la base GeoIP MaxMind :

- **Mount path** : `/app/data`
- **Source** : Volume nommé `maisoneloria_maxmind`

### 3.5 Déployer

Cliquer **Deploy**. Au démarrage, Alembic crée/migre les tables automatiquement.

Vérification :

```bash
# Logs du service backend dans EasyPanel
... INFO Database migrations applied successfully
... INFO Application startup complete.
```

---

## 4. Déploiement du Frontend (Next.js + nginx)

### 4.1 Créer le service

EasyPanel → **+ Create app → App**

- Name : `frontend`
- Source : Git repo **ou** upload du dossier `frontend/`
- Build path : `/`
- Dockerfile path : `Dockerfile`

### 4.2 Build args (variables exposées au build Next)

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=https://maisoneloria.shop
NEXT_PUBLIC_WHATSAPP_NUMBER=212754127109
NEXT_PUBLIC_FB_PIXEL_ID=
NEXT_PUBLIC_TT_PIXEL_ID=
NEXT_PUBLIC_SC_PIXEL_ID=
```

> `NEXT_PUBLIC_API_URL` reste **vide** : le client utilise alors `/api/...` (chemin relatif), et nginx redirige vers le service backend en interne.

### 4.3 Ports & Domaine

- **Internal port** : `3000`
- **Public domain** : `maisoneloria.shop` + `www.maisoneloria.shop`

EasyPanel s'occupe du certificat SSL (Let's Encrypt) automatiquement.

### 4.4 Vérifier la connectivité backend

Le `nginx.conf` du frontend pointe sur le hostname **`backend`**.

➡️ Le service backend doit donc s'appeler **exactement `backend`** dans EasyPanel.
- Si vous le nommez différemment (ex: `maisoneloria-api`), ouvrez `frontend/nginx.conf` et remplacez `set $backend_upstream "http://backend:8000";` par le bon nom.

### 4.5 Déployer

Cliquer **Deploy**. Le build prend 2–4 min (npm ci + next build).

---

## 5. DNS

Dans Cloudflare (ou votre registrar DNS) :

| Type | Nom | Cible | Proxy |
| --- | --- | --- | --- |
| A | `maisoneloria.shop` | IP du VPS EasyPanel | Activé (orange) |
| CNAME | `www` | `maisoneloria.shop` | Activé |

> **Important** : Cloudflare Pages reste actif tant que vous ne supprimez pas les enregistrements précédents. Pour basculer 100 % sur EasyPanel, supprimer les anciens enregistrements `pages.dev` ou les CNAME vers Cloudflare Pages.

---

## 6. Vérifications post-déploiement

### 6.1 Health check backend

```bash
curl https://maisoneloria.shop/api/health
# {"status":"ok","timestamp":"...","version":"1.0.0"}
```

### 6.2 Soumettre un test de commande

```bash
curl -X POST https://maisoneloria.shop/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "اختبار",
    "customer_phone": "0612345678",
    "customer_city": "الدار البيضاء",
    "items": [{"product_name": "غطاء كرسي - بيج", "variant": "باك 4", "quantity": 1, "price": 250}],
    "total": 250
  }'
# {"success":true,"order":{...},"message":"شكراً لك..."}
```

### 6.3 Lecture admin

```bash
TOKEN=$(curl -s -X POST https://maisoneloria.shop/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_ADMIN_USERNAME","password":"YOUR_ADMIN_PASSWORD"}' | jq -r .token)

curl -H "Authorization: Bearer $TOKEN" https://maisoneloria.shop/api/admin/orders
```

### 6.4 Tableau de bord visuel

Ouvrir `https://maisoneloria.shop/admin` → saisir le username et password définis dans vos variables d'environnement EasyPanel.

---

## 7. Désactiver l'ancien Cloudflare Pages (optionnel)

Une fois EasyPanel validé :

1. Cloudflare Dashboard → **Workers & Pages** → projet `maisoneloria` → **Custom Domains** → retirer `maisoneloria.shop` et `www.maisoneloria.shop`.
2. La base D1 peut rester (gratuite) ou être supprimée.
3. Les Pages Functions ne sont plus appelées dès que le DNS pointe vers EasyPanel.

---

## 8. Mise à jour ultérieure

À chaque `git push` (ou nouvel upload) :

- EasyPanel → service `backend` → **Redeploy**
- EasyPanel → service `frontend` → **Redeploy**

Les migrations Alembic s'appliquent automatiquement au démarrage.

---

## 9. Récapitulatif des services

```
EasyPanel project = maisoneloria
├── Postgres : maisoneloria_database (déjà présent)
├── App      : backend           (FastAPI, port 8000, sans domaine)
└── App      : frontend          (Next.js + nginx, port 3000, https://maisoneloria.shop)
```

Tout transite par EasyPanel ; rien d'externe n'est requis pour le runtime applicatif.
