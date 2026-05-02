# PAGES SPECIFICATION — Maison Eloria

## Global Elements (All Pages)

### Announcement Bar (Top)
- Background: `brand-600` with gold accent
- Text: "🚚 توصيل مجاني لجميع أنحاء المغرب | الدفع عند الاستلام"
- Dismissible (X button)

### Header
- Sticky with backdrop blur
- **Right side**: M logo icon (circle, brand-600) + "Maison Eloria" text
- **Center** (desktop): Home, Collection, About, Contact
- **Left side**: Cart icon with item count badge
- Mobile: Hamburger menu on left, logo center, cart right

### Footer
- Background: `brand-600`
- Columns:
  1. Brand logo + short description + social icons
  2. Quick Links: Home, Collection, About, Contact
  3. Help: FAQ, Politique de retour, Livraison
  4. Contact: WhatsApp, Email, Address
- Bottom bar: "© 2026 Maison Eloria — جميع الحقوق محفوظة"
- Payment icons: COD badge, trust badges

### Sticky WhatsApp Button
- Fixed bottom-left (LTR) / bottom-right (RTL)
- Green WhatsApp icon
- Pulse animation
- Opens `wa.me/212XXXXXXXXX`

### Sticky Mobile CTA (Product/Collection pages only)
- Fixed bottom bar on mobile
- Shows price + "أضف للسلة" button
- Slides up on scroll down, hides on scroll up

---

## Page 1: HOME (/)

### Section 1: Hero
- **Layout**: Full-width, min-height 80vh on mobile
- **Background**: Lifestyle image of beautiful Moroccan salon with Eloria covers
- **Overlay**: Gradient from dark to transparent
- **Content** (centered):
  - Badge: "🏆 العلامة رقم 1 في المغرب لأغطية الكراسي"
  - H1: "حوّلي صالونك بأغطية كراسي لا تفقد لونها أبداً"
  - Subtitle: "مصنوعة بقماش أوروبي فاخر — 9 ألوان — توصيل مجاني"
  - CTA button: "اكتشفي المجموعة" → /collection
  - Trust row: ⭐ 4.8/5 (2,847 تقييم) | 🚚 توصيل مجاني | 💳 الدفع عند الاستلام
- **Mobile**: Stack vertically, CTA full-width

### Section 2: Pain Agitation
- **Layout**: 2-column (image left, text right) — reversed on RTL
- **Left**: Before/after image slider or side-by-side
- **Right**:
  - H2: "واش كراسي الصالون ديالك ولّاو هكذا؟"
  - Pain points list with ❌ icons:
    - "اللون طالع من أول غسلة"
    - "المقاس ماشي مضبوط — كايتزحلق"
    - "شكل قديم كايخسّر الديكور"
    - "كاتحشمي تستقبلي الضيوف"
  - CTA: "الحل موجود ←"

### Section 3: Product Showcase
- **Layout**: 2-column reversed (text left, image right)
- **Left**:
  - H2: "أغطية Maison Eloria — الفرق واضح"
  - Benefits list with ✅ icons:
    - "قماش فاخر لا يفقد لونه — مجرّب ومضمون"
    - "مقاس مفصّل — كايجي على كل أنواع الكراسي"
    - "9 ألوان تتناسب مع أي ديكور"
    - "سهل التركيب — في دقيقة واحدة"
  - Button: "شوفي الألوان"
- **Right**: Product grid showing 3-4 colors on chairs

### Section 4: Offers Section
- **H2**: "اختاري الباك المناسب ليك"
- **3-column grid** (stacked on mobile):

**Card 1 — Pack 4:**
- "باك 4 قطع"
- ~~356 DH~~ → **250 DH**
- "62.5 DH للقطعة"
- Features list
- CTA: "اطلبي دابا"

**Card 2 — Pack 6 (Popular):**
- "الأكثر طلباً" badge
- "باك 6 قطع"
- ~~534 DH~~ → **330 DH**
- "55 DH للقطعة — وفّري 204 DH"
- Features list
- CTA: "اطلبي دابا"

**Card 3 — Pack 9 (Best Value):**
- "⭐ أحسن عرض" gold badge
- "باك صالون كامل — 9 قطع"
- ~~801 DH~~ → **380 DH**
- "42.2 DH للقطعة — وفّري 421 DH"
- Features list
- Gold CTA: "اطلبي الآن"
- Highlighted border (gold)

### Section 5: Social Proof — Reviews
- **H2**: "شنو قالو عملاءنا"
- **Carousel** of review cards:
  - Star rating (5 stars)
  - Review text in Darija
  - Customer name + city
  - "عملية شراء مؤكدة ✅" badge
  - Optional: customer photo
- "4.8/5 من 2,847 تقييم" below
- At least 8 reviews (realistic Darija text)

### Section 6: Trust & Authority
- **Layout**: Icon grid (2x3 on mobile, 6 columns on desktop)
- Trust items:
  - 🏭 "صنع في المغرب" — "منتج مغربي 100%"
  - 🧵 "قماش أوروبي فاخر" — "مستورد من أحسن المصانع"
  - ✅ "ضمان 30 يوم" — "إرجاع مجاني إذا ما عجبكش"
  - 🚚 "توصيل مجاني" — "لجميع مدن المغرب"
  - 💳 "الدفع عند الاستلام" — "ما تخلصي حتى توصلك"
  - 📞 "خدمة عملاء" — "WhatsApp 7/7"

### Section 7: How It Works
- **H2**: "3 خطوات بسيطة"
- 3 steps with numbered circles + icons:
  1. "اختاري اللون والباك" (icon: palette)
  2. "أكدي الطلب — الدفع عند الاستلام" (icon: phone)
  3. "استقبلي الطرد في بابك" (icon: truck)

### Section 8: Comparison Table
- **H2**: "ليش Maison Eloria مختلفة؟"
- Side-by-side table:
  | الميزة | Maison Eloria ✅ | أغطية عادية ❌ |
  |--------|-----------------|---------------|
  | ثبات اللون | لا يفقد لونه | يتلف بعد غسلة |
  | المقاس | مفصّل بدقة | مقاس واحد |
  | الألوان | 9 ألوان | 2-3 ألوان |
  | الضمان | 30 يوم | لا ضمان |
  | التوصيل | مجاني | مدفوع |
  | التغليف | فاخر | كيس بلاستيك |

### Section 9: FAQ
- **H2**: "أسئلة شائعة"
- Accordion items:
  1. "واش الألوان حقيقية بحال الصورة؟"
  2. "واش كايجي على كل أنواع الكراسي؟"
  3. "شحال كايوخذ التوصيل؟"
  4. "واش نقدر نرجّعو إلا ما عجبنيش؟"
  5. "واش نقدر نغسلهم في الماكينة؟"
  6. "كيفاش نختار المقاس المناسب؟"
  7. "واش الدفع عند الاستلام؟"

### Section 10: Final CTA
- Background: brand-600 gradient
- H2: "صالونك يستاهل الأحسن"
- Text: "انضمّي لأكثر من 50,000 عائلة مغربية اختارت Maison Eloria"
- Large gold CTA: "اطلبي الآن — توصيل مجاني 🚚"
- Below: Trust badges row

---

## Page 2: COLLECTION (/collection)

### Hero Section
- Shorter hero (40vh)
- H1: "مجموعتنا — أغطية كراسي فاخرة"
- Subtitle: "اختاري من 9 ألوان — أقمشة لا تفقد لونها"

### Filter Bar
- Color filter: circle swatches
- Pack filter: "4 قطع" | "6 قطع" | "9 قطع"
- Sort: "الأكثر طلباً" | "السعر: الأقل" | "السعر: الأعلى"

### Product Grid
- 2 columns mobile, 3 columns desktop
- Each card:
  - Product image (chair with cover)
  - Color name
  - "ابتداءً من 250 DH"
  - Star rating
  - Quick "أضف للسلة" button
  - "الأكثر مبيعاً" badge on popular colors

### Bottom CTA
- "ما لقيتيش اللون ديالك؟ تواصلي معنا على WhatsApp"

---

## Page 3: PRODUCT (/product/housse-chaise-[color])

### Product Gallery (Left/Top on mobile)
- Main image (large)
- Thumbnail strip (4-6 images)
- Zoom on hover (desktop)
- Swipe gallery (mobile)
- Images: product on chair, close-up fabric, packaging, lifestyle

### Product Info (Right/Below on mobile)
- Badge: "🔥 الأكثر مبيعاً"
- H1: "غطاء كرسي Eloria — [Color Name]"
- Star rating: ⭐⭐⭐⭐⭐ 4.8 (2,847 تقييم)
- Price section:
  - Old price (crossed out): "89 DH / القطعة"
  - Current: "ابتداءً من 62.5 DH / القطعة"

### Color Selector
- 9 color swatches (circles)
- Selected color name displayed
- Changes main image on selection

### Pack Selector
- 3 radio cards (vertically stacked):
  
  **Pack 4** — ~~356 DH~~ **250 DH** — "62.5 DH / القطعة"
  
  **Pack 6** — ~~534 DH~~ **330 DH** — "55 DH / القطعة" — 🏷️ "الأكثر طلباً"
  
  **Pack 9** — ~~801 DH~~ **380 DH** — "42.2 DH / القطعة" — ⭐ "أحسن عرض"

### Add to Cart Section
- Large green CTA: "🛒 أضف للسلة"
- Below: "🚚 توصيل مجاني | 💳 الدفع عند الاستلام"
- Scarcity: "⏰ العرض ينتهي خلال XX:XX:XX"
- Live viewers: "👁 47 شخص كايشوفو هاد المنتج دابا"

### Trust Badges Row
- 6 horizontal badges (scrollable on mobile)

### Product Description
- Alternating image/text sections:
  1. **Fabric Quality**: Image of fabric close-up + text about European fabric
  2. **Easy Installation**: Video/GIF of putting cover on chair + text
  3. **Machine Washable**: Washing machine image + care instructions
  4. **Perfect Fit**: Different chair types image + sizing info

### Reviews Section
- Same as homepage reviews but with "تقييمات هذا المنتج" heading
- Option to see all reviews

### Cross-sell Section
- "عملاء اشتروا أيضاً" heading
- Related color suggestions

### Sticky Mobile CTA
- Fixed at bottom of screen on mobile
- Price + "أضف للسلة" button
- Always visible

---

## Page 4: ABOUT (/about)

### Hero
- H1: "قصتنا — ميزون إلوريا"
- Elegant lifestyle image

### Our Story Section
- Alternating layout:
  1. Image of atelier + founding story text
  2. Image of fabric selection + quality commitment text
  3. Image of team + mission text

### Our Values
- 4-column grid:
  - 🎯 "الجودة أولاً"
  - 🇲🇦 "فخر مغربي"
  - 💚 "رضا العميل"
  - ♻️ "استدامة"

### Numbers Section
- Counter animation:
  - "50,000+" عائلة مغربية
  - "200,000+" غطاء مباع
  - "48" ولاية
  - "4.8/5" تقييم

### CTA
- "اكتشفي مجموعتنا" → /collection

---

## Page 5: CONTACT (/contact)

### Layout: 2-column
**Left**: Contact form
- Name input
- Phone input (Moroccan validation)
- Message textarea
- Submit button

**Right**: Contact info
- WhatsApp: +212 XXX XXX XXX
- Email: contact@maisoneloria.shop
- Working hours: الأحد - الجمعة: 9:00 - 21:00
- Address (if applicable)
- Google Maps embed (optional)

### FAQ Section (below)
- Common questions about orders, returns, shipping

---

## Page 6: THANK YOU (/thank-you)

### Content (centered)
- ✅ Large green checkmark animation
- H1: "شكراً لك! تم استلام طلبك بنجاح"
- Order number: "ELO-XXXX"
- Order summary:
  - Pack type
  - Colors selected
  - Total price
  - Delivery estimate: "2-4 أيام عمل"
- Trust message: "سيتواصل معك فريقنا عبر WhatsApp لتأكيد الطلب"
- WhatsApp button: "تواصل معنا على WhatsApp"

### Cross-sell (below)
- "قد يعجبك أيضاً" with other color suggestions
- Special "خصم 10% على طلبك القادم" with code

### Social Sharing
- "شارك مع صديقاتك"
- Facebook, WhatsApp share buttons

---

## Cart Drawer (Global Overlay)

### Trigger
- Click cart icon in header
- Auto-opens when item added to cart

### Drawer Layout (slides from left in RTL)
- Header: "سلة المشتريات" + close X
- Item list:
  - Product image thumbnail
  - Color name
  - Pack type
  - Price
  - Quantity controls (+/-)
  - Remove button
- Cross-sell section:
  - "أكملي الصالون ديالك" heading
  - 2-3 suggested items based on what's in cart
- Subtotal
- Free shipping badge
- "الدفع عند الاستلام" badge
- CTA: "إتمام الطلب" → opens Checkout Popup

---

## Checkout Popup (Modal Overlay)

### Trigger
- Click "إتمام الطلب" in cart drawer

### Layout
- Modal overlay with backdrop blur
- Max-width: 480px, centered

### Content

**Left/Top Section — Order Summary:**
- Each item: image, name, color, pack, price
- Subtotal
- Shipping: مجاني
- Total (large, bold)

**Social Proof Bar:**
- "🔒 طلب آمن"
- "✅ 50,000+ عملية شراء ناجحة"
- "⭐ 4.8/5 تقييم"

**Scarcity:**
- "⚡ 7 أشخاص آخرين يطلبون الآن"

**Form (2 fields only):**
- **الاسم الكامل**: Text input, required
- **رقم الهاتف**: Tel input, required, Moroccan validation (06/07 + 8 digits)
  - Placeholder: "06XXXXXXXX"
  - Real-time validation with error message
  - Auto-format

**CTA Button:**
- Large gold/green: "✅ تأكيد الطلب — الدفع عند الاستلام"
- Below: "🚚 توصيل مجاني خلال 2-4 أيام"

**Trust Badges (bottom):**
- COD icon + "الدفع عند الاستلام"
- Shield icon + "ضمان 30 يوم"
- Truck icon + "توصيل مجاني"
