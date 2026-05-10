# PRODUCT SPECIFICATION — Maison Eloria

## Product: Custom-Fit Chair Covers (أغطية كراسي مفصّلة)

### Product Name
- **Arabic**: غطاء كرسي إلوريا
- **French**: Housse de Chaise Eloria
- **Slug**: `housse-chaise-eloria`

### Key Selling Points
1. **قماش لا يفقد لونه** — Fabric that never fades (premium European-grade stretch)
2. **مقاس مفصّل** — Custom-fit for all chair types
3. **سهل التركيب** — Easy to install (under 1 minute)
4. **قابل للغسل** — Machine washable
5. **9 ألوان متناسقة** — 9 coordinated colors
6. **تغليف فاخر** — Premium packaging

### Fabric Claims
- "Tissu stretch européen haute qualité"
- "Résiste à 500+ lavages sans perte de couleur"
- "Tissu anti-tache et anti-pli"
- "Elasticité 4 directions — s'adapte à toutes les formes"

---

## Colors (9 Total)

| ID | Name (AR) | Name (FR) | Hex Code | Image File |
|----|-----------|-----------|----------|------------|
| `beige` | بيج | Beige | #D4C5A9 | `beige.jpg` |
| `gris` | رمادي | Gris | #8E8E8E | `gris.jpg` |
| `marron` | بني | Marron | #6B4226 | `marron.jpg` |
| `noir` | أسود | Noir | #2C2C2C | `noir.jpg` |
| `blanc` | أبيض كريمي | Blanc Crème | #F5F5F0 | `blanc.jpg` |
| `bordeaux` | أحمر نبيذي | Bordeaux | #722F37 | `bordeaux.jpg` |
| `bleu-marine` | أزرق بحري | Bleu Marine | #1B3A5C | `bleu-marine.jpg` |
| `olive` | أخضر زيتوني | Vert Olive | #556B2F | `olive.jpg` |
| `creme` | كريمي | Crème | #FFFDD0 | `creme.jpg` |

### Color Images Required (per color)
1. **Main**: Chair with cover installed (front view, neutral background)
2. **Lifestyle**: Chair in a Moroccan-style living room setting
3. **Close-up**: Fabric texture detail
4. **Packaging**: Cover folded in packaging
5. **Multiple**: 2-3 chairs with same color in a room

### Placeholder Images
For development, use solid-color placeholder images with the hex codes above. Generate using:
- 800x800px product shots (square)
- 1200x600px lifestyle shots (landscape)
- 600x600px close-up shots (square)

---

## Pricing & Offers

### Pack Structure

#### Pack 4 — "باك المبتدئ"
```json
{
  "id": "pack_4",
  "name_ar": "باك 4 قطع",
  "name_fr": "Pack 4 pièces",
  "pieces": 4,
  "price": 250,
  "original_price": 356,
  "per_piece": 62.5,
  "per_piece_original": 89,
  "savings": 106,
  "badge": null,
  "popular": false
}
```

#### Pack 6 — "باك العائلة" ⭐ Most Popular
```json
{
  "id": "pack_6",
  "name_ar": "باك 6 قطع",
  "name_fr": "Pack 6 pièces",
  "pieces": 6,
  "price": 330,
  "original_price": 534,
  "per_piece": 55,
  "per_piece_original": 89,
  "savings": 204,
  "badge": "الأكثر طلباً",
  "popular": true
}
```

#### Pack 9 — "باك الصالون الكامل" 🏆 Best Value
```json
{
  "id": "pack_9",
  "name_ar": "باك صالون كامل — 9 قطع",
  "name_fr": "Pack Salon Complet — 9 pièces",
  "pieces": 9,
  "price": 380,
  "original_price": 801,
  "per_piece": 42.2,
  "per_piece_original": 89,
  "savings": 421,
  "badge": "⭐ أحسن عرض",
  "popular": false,
  "best_value": true
}
```

### Price Anchoring
- **Original per-piece price**: 89 MAD (always shown crossed out)
- **Savings**: Always shown as "وفّر/ي X درهم"
- **Percentage**: Show "-30%", "-38%", "-53%" badges on pack cards

---

## Cross-Sell Strategy

### In Cart Drawer
When user has items in cart, suggest:
1. **Color complement**: "أضيفي لون [complementary color] لتنسيق الصالون"
2. **Upgrade**: If Pack 4 in cart → "غيّري لباك 6 ووفّري 15 DH إضافية للقطعة"
3. **Additional set**: "أضيفي مجموعة ثانية لغرفة أخرى"

### On Thank You Page
- "خصم 10% على طلبك القادم — الكود: MERCI10"

---

## Product Data Structure (Frontend)

```typescript
interface Product {
  id: string;
  slug: string;
  name_ar: string;
  name_fr: string;
  description_ar: string;
  description_fr: string;
  colors: Color[];
  packs: Pack[];
  features: Feature[];
  images: ProductImage[];
  reviews: Review[];
  rating: number;
  review_count: number;
  in_stock: boolean;
  shipping_info: string;
  return_policy: string;
}

interface Color {
  id: string;
  name_ar: string;
  name_fr: string;
  hex: string;
  images: string[];
  in_stock: boolean;
}

interface Pack {
  id: string;
  name_ar: string;
  name_fr: string;
  pieces: number;
  price: number;
  original_price: number;
  per_piece: number;
  savings: number;
  badge: string | null;
  popular: boolean;
  best_value: boolean;
}

interface CartItem {
  pack: Pack;
  color: Color;
  quantity: number;
}
```

---

## Shipping Information

- **Free shipping** on all packs (already included in price)
- **Delivery time**: 2-4 business days (all Morocco)
- **Carrier**: Amana Express / CTM (placeholder)
- **Tracking**: Order number provided after purchase
- **Payment**: Cash on Delivery (COD) only

---

## Return Policy

- **30-day money-back guarantee**
- **Conditions**: Product must be unused, in original packaging
- **Process**: Contact via WhatsApp → return label sent → refund on receipt
- **Display prominently**: This is a MAJOR trust signal for Moroccan COD buyers

---

## Reviews Data (Seed)

Use these realistic reviews in Darija for the website:

```json
[
  {
    "name": "سارة من الدار البيضاء",
    "rating": 5,
    "text": "والله ما ندمت! الأغطية جاو مزيانين بزاف. اللون بيج كايتناسب مع الصالون ديالي تماماً. جاراتي كلهم سوّلوني فين شريتهم 😍",
    "verified": true,
    "date": "2026-04-15"
  },
  {
    "name": "فاطمة الزهراء من الرباط",
    "rating": 5,
    "text": "كنت خايفة يكونو بحال لي كاينين في السوق — ولكن فرق السما والأرض! القماش ثقيل ومتين واللون ما تبدّلش حتى بعد 3 غسلات",
    "verified": true,
    "date": "2026-04-10"
  },
  {
    "name": "أمينة من فاس",
    "rating": 5,
    "text": "خذيت باك 9 قطع — الصالون كامل ولّا كأنه جديد! التوصيل جا في يومين والتغليف فاخر. شكراً Maison Eloria ❤️",
    "verified": true,
    "date": "2026-04-08"
  },
  {
    "name": "خديجة من مراكش",
    "rating": 4,
    "text": "الجودة ممتازة والألوان حقيقية بحال الصورة. غير كنتمنى يزيدو ألوان أكثر. غادي نرجع نطلب باك ثاني للبيت ديال ماما",
    "verified": true,
    "date": "2026-04-05"
  },
  {
    "name": "يوسف من طنجة",
    "rating": 5,
    "text": "شريت لمراتي هدية — فرحات بزاف! الصالون ولّا واعر. أحسن قرار خذيت هاد الشهر 👌",
    "verified": true,
    "date": "2026-04-01"
  },
  {
    "name": "نادية من أكادير",
    "rating": 5,
    "text": "كنت كانبدّل أغطية الكراسي كل 3 شهور حيت اللون كايطلع. هادو بقاو مزيانين من شهر يناير! ما شاء الله على الجودة",
    "verified": true,
    "date": "2026-03-28"
  },
  {
    "name": "محمد من وجدة",
    "rating": 5,
    "text": "التوصيل كان سريع بزاف — يومين فقط لوجدة. والأغطية جاو في علبة مزيانة مع كارطة شكر. خدمة ممتازة",
    "verified": true,
    "date": "2026-03-25"
  },
  {
    "name": "حسناء من القنيطرة",
    "rating": 5,
    "text": "خذيت اللون البني والأزرق — كايتناسبو مع بعضياتهم بشكل رائع! صحباتي كلهم بغاو يطلبو نفس الشي 😊",
    "verified": true,
    "date": "2026-03-20"
  }
]
```

---

## SEO Metadata

### Home
- **Title**: "Maison Eloria — أغطية كراسي فاخرة | توصيل مجاني في المغرب"
- **Description**: "أغطية كراسي مفصّلة بقماش أوروبي لا يفقد لونه. 9 ألوان، توصيل مجاني، الدفع عند الاستلام. أكثر من 50,000 عائلة مغربية تثق بنا."

### Product
- **Title**: "غطاء كرسي إلوريا [Color] — ابتداءً من 42 DH/قطعة | Maison Eloria"
- **Description**: "غطاء كرسي [Color] بقماش فاخر لا يفقد لونه. باك 4/6/9 قطع بأسعار خاصة. توصيل مجاني والدفع عند الاستلام."

### Collection
- **Title**: "مجموعة أغطية الكراسي — 9 ألوان | Maison Eloria"
- **Description**: "اكتشف مجموعتنا الكاملة من أغطية الكراسي الفاخرة. 9 ألوان تتناسب مع أي ديكور. توصيل مجاني والدفع عند الاستلام."
