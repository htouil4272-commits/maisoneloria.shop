# ⚡ FAST LAUNCH — تشغيل maisoneloria.shop في 10 دقائق

> هذا الدليل مبسّط للحدّ الأقصى. اتّبعيه خطوة بخطوة وسيكون موقعكِ مباشرًا اليوم.

---

## 🎯 المسار الأسرع: Cloudflare Pages (مجاني)

### الخطوة 1️⃣ — افتحي Cloudflare Pages (دقيقة واحدة)

1. اذهبي إلى: **https://dash.cloudflare.com/pages**
2. سجّلي الدخول بنفس الحساب الذي اشتريتِ به الـdomain
3. اضغطي على زر **"Create a project"** → **"Direct Upload"**

### الخطوة 2️⃣ — رفع الـZIP (دقيقتان)

1. **اسم المشروع** (Project name): اكتبي `maisoneloria`
2. **رفع الملفات**: اسحبي ملف **`maisoneloria-frontend.zip`** من سطح المكتب إلى المنطقة المخصّصة
3. اضغطي **"Deploy site"**
4. انتظري 30-60 ثانية، سيعطيكِ Cloudflare رابطًا مؤقّتًا مثل: `https://maisoneloria.pages.dev` ← **الموقع الآن مباشر!**

### الخطوة 3️⃣ — ربط النطاق `maisoneloria.shop` (3 دقائق)

1. في صفحة المشروع الذي رفعتِه، اضغطي على تبويب **"Custom domains"**
2. اضغطي **"Set up a custom domain"**
3. اكتبي: `maisoneloria.shop`
4. اضغطي **"Continue"** → **"Activate domain"**
5. كرّري نفس الخطوة لـ `www.maisoneloria.shop`

> Cloudflare سيُحدّث DNS تلقائيًا (لأن النطاق عندهم). انتظري 1-3 دقائق.

### الخطوة 4️⃣ — انتهت! ✅

افتحي **https://maisoneloria.shop** في المتصفح. الموقع مباشر ويعمل بـSSL تلقائيًا.

---

## 🔥 روابط Funnel الجاهزة للإعلانات

بعد التفعيل، هذه الروابط تشتغل فورًا:

| الـURL | الاستخدام |
|---|---|
| `https://maisoneloria.shop/` | الصفحة الرئيسية (catalog) |
| `https://maisoneloria.shop/shop.html` | صفحة التسوّق |
| **`https://maisoneloria.shop/lp/pack-famille`** | 🎯 إعلانات Facebook (باك العائلة 399 DH) |
| **`https://maisoneloria.shop/lp/housse-cedre`** | 🎯 إعلانات TikTok (قطعة واحدة 119 DH) |
| **`https://maisoneloria.shop/lp/pack-salon`** | 🎯 إعلانات Instagram (باك صالون 549 DH) |
| `https://maisoneloria.shop/track.html` | تتبّع الطلبات |
| `https://maisoneloria.shop/contact.html` | التواصل |

---

## ⚠️ ما الذي يعمل الآن وما الذي يحتاج خطوة إضافية؟

### ✅ يعمل فورًا (بدون backend):

- ✅ كل صفحات الموقع (`/`, `/shop`, `/product`, `/lp/*`, `/about`, `/contact`...)
- ✅ السلّة (cart) المحفوظة في المتصفح
- ✅ زرار **WhatsApp** على كل الصفحات
- ✅ **Checkout** يفتح WhatsApp مع الطلب الجاهز
- ✅ كل التصاميم والـSVG والـanimations
- ✅ تغيير اللغة (FR / AR)

### ⏸️ يحتاج backend منشور (اختياري للبداية):

- ⏸️ حفظ الطلبات في قاعدة بيانات (لكن WhatsApp يستلم الطلب فعليًا)
- ⏸️ نشرة إخبارية (Newsletter)
- ⏸️ استمارة الـContact (تذهب للقاعدة)
- ⏸️ صفحة Tracking تجلب الطلب من API
- ⏸️ Admin Panel (إحصائيات + CSV)

> 💡 **توصيتي**: انشري الـfrontend أولاً واستخدمي WhatsApp فقط للأسبوع الأول. بعدها انشري الـbackend بهدوء.

---

## 🛑 شرط واحد قبل الإطلاق: تحديث رقم WhatsApp

**هذا حرفيًا الشيء الوحيد الذي يجب فعله قبل النشر:**

1. افتحي ملف: `site/assets/data/products.json`
2. ابحثي عن السطر:
   ```json
   "whatsapp": "212600000000"
   ```
3. غيّريه إلى رقمكِ الحقيقي (بدون `+` وبدون مسافات):
   - مثال: `"whatsapp": "212661234567"`
4. احفظي الملف
5. أعيدي ضغط مجلّد `site` إلى ZIP جديد:
   - PowerShell: `Compress-Archive -Path "site\*" -DestinationPath "maisoneloria-frontend.zip" -Force`
   - أو يدويًا في Windows: كليك يمين على مجلّد `site` → "Send to" → "Compressed (zipped) folder"
6. ارفعيه على Cloudflare Pages كما في الخطوة 2

---

## 🔌 (اختياري) نشر الـBackend على EasyPanel

> اعمليه فقط بعد التأكّد من أن الـfrontend يعمل ويستلم طلبات حقيقية. ليس عاجلاً.

### في لوحة EasyPanel:

1. **Create Service** → **App** → اسمه: `maisoneloria-api`
2. **Source**: ارفعي ملف `maisoneloria-backend.zip` أو اربطيه بـGit
3. **Build**:
   - Build command: `npm install --production`
   - Start command: `node server.js`
4. **Environment Variables** (كوبي/پيست هذا):
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgres://postgres:TzMLLTcIUgCHBhpVuXVwcWIL@[postgres-service]:5432/postgres
   ADMIN_USER=admin
   ADMIN_PASSWORD=QTReLG4bmGFYUhlKYPb8RPQwewcs
   ALLOWED_ORIGINS=https://maisoneloria.shop,https://www.maisoneloria.shop
   ```
5. **Domain**: اربطيها بـ `api.maisoneloria.shop`
6. **Database**: أنشئي PostgreSQL service وضعي بيانات الاتصال في `DATABASE_URL`

### في Cloudflare DNS:

أضيفي record جديد:
```
Type: CNAME
Name: api
Target: [domain-easypanel-الذي-أعطاكِ]
Proxy: OFF (rouge cloud disabled)
```

> Cloudflare سيصدر SSL تلقائيًا في أول طلب.

---

## 🚀 الخلاصة في 60 ثانية

| الخطوة | ما تفعلين | الوقت |
|---|---|---|
| 1 | غيّري رقم WhatsApp في `products.json` وأعيدي ضغط الـZIP | 2 دقائق |
| 2 | اذهبي إلى dash.cloudflare.com/pages → Direct Upload | 1 دقيقة |
| 3 | اسحبي الـZIP وانتظري 30 ثانية | 1 دقيقة |
| 4 | في Custom domains: أضيفي `maisoneloria.shop` و `www.maisoneloria.shop` | 3 دقائق |
| 5 | افتحي **https://maisoneloria.shop** ✅ | 1 دقيقة |

**الكلّ < 10 دقائق ✨**

---

## 🆘 إذا حدثت مشكلة

- **خطأ "domain already in use"**: تأكّدي أنّ النطاق غير مرتبط بمشروع Cloudflare آخر. إن كان مرتبطًا بـ `maisoneloria.pages.dev` آخر، احذفي الإعداد القديم.
- **Cloudflare يطلب nameservers**: تأكّدي أن النطاق مُسجّل في Cloudflare كـregistrar. إن لم يكن، انقليه (Transfer) أو غيّري الـNS.
- **HTTPS لا يعمل بعد 10 دقائق**: في Cloudflare → SSL/TLS → اضبطي على **"Full"**.
- **404 على روابط `/lp/pack-famille`**: Cloudflare يقدّم `.html` تلقائيًا، لذا لا داعي لقلق.

---

## 📞 جاهز؟

- ☑️ ZIP جاهز عندكِ على سطح المكتب
- ☑️ حساب Cloudflare الذي اشتريتِ منه `maisoneloria.shop`
- ☑️ رقم WhatsApp تجاري حقيقي

**ابدئي الآن. الموقع سيكون مباشرًا في 10 دقائق. 🌹**
