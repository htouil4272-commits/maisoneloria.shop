# CRO PLAYBOOK — Maison Eloria

## Conversion Rate Optimization Tactics

Every element on the site is designed to push the visitor toward one action: **placing an order**. Here's the complete playbook.

---

## 1. Above-the-Fold Optimization

### Hero Section (< 3 seconds to convince)
- **Headline**: Clear value proposition in Darija
- **Subheadline**: Key differentiator (quality, free shipping, COD)
- **CTA**: One primary action, contrasting color
- **Trust signals**: Rating stars + review count + delivery info
- **Image**: Show the product in use (lifestyle shot)

### Rules
- No sliders/carousels (they kill conversions)
- One hero, one message, one CTA
- Mobile: headline + image + CTA must fit without scrolling

---

## 2. Social Proof Engine

### A. Review Stars (Everywhere)
- Show "⭐ 4.8/5 (2,847 تقييم)" on:
  - Hero section
  - Product page (near price)
  - Checkout popup
  - Cart drawer

### B. Customer Review Cards
- Photo + name + city + verified badge
- Written in Darija (authentic feel)
- Mix of men and women reviewers
- Mention specific benefits ("اللون ما تبدّلش", "التوصيل كان سريع")

### C. Recent Purchase Notifications (Toast)
```
"✅ فاطمة من مراكش اشترت باك 6 قبل 3 دقائق"
```
- Show every 15-30 seconds
- Rotate through fake + real data
- Bottom-left corner, auto-dismiss after 4s
- Show city names (Casablanca, Rabat, Marrakech, Fès, Tanger...)

### D. Live Viewers Counter
```
"👁 47 شخص كايشوفو هاد المنتج دابا"
```
- Random number between 25-65
- Updates every 30 seconds (±3)
- Show on product page only

### E. Trust Counter Animation
On homepage, animated counters:
- "50,000+" عائلة
- "200,000+" غطاء مباع
- "4.8/5" تقييم
- Count up animation on scroll-into-view

---

## 3. Urgency & Scarcity

### A. Countdown Timer
```
⏰ العرض ينتهي خلال: 02:34:17
```
- Show on product page and checkout
- Resets daily at midnight
- Or: "العرض ينتهي اليوم" with remaining hours

### B. Limited Stock
```
📦 باقي غير 23 باك في المخزون
```
- Random number 15-50
- Decrements slowly (every 2-5 minutes, -1)
- Resets on page reload to new random number

### C. Flash Sale Badge
- On best-value pack card: "🔥 عرض محدود"
- Red/gold background

---

## 4. Price Psychology

### A. Anchoring
- Always show "السعر العادي: 89 DH / القطعة" crossed out
- Then show pack price which feels like a massive deal
- Savings amount in green: "وفّري 421 DH!"

### B. Per-Piece Breakdown
- "42.2 DH / القطعة" makes 380 DH feel cheap
- "أقل من ثمن قهوة في اليوم" reframe

### C. Decoy Effect
- Pack 4 (250 DH) exists primarily to make Pack 6 (330 DH) and Pack 9 (380 DH) look like better value
- Pack 9 is only 50 DH more than Pack 6 for 3 extra pieces → obvious best deal

### D. Pack Comparison Visual
```
Pack 4:  ████░░░░░  62.5 DH/piece
Pack 6:  ██████░░░  55 DH/piece    ← الأكثر طلباً
Pack 9:  █████████  42.2 DH/piece  ← ⭐ أحسن عرض
```

---

## 5. Friction Reduction

### A. Checkout = 2 Fields Only
- Name + Phone. That's it.
- No email, no address, no account
- COD means they pay on delivery → zero payment friction

### B. Cart Drawer (Not Cart Page)
- Never navigate away from the current page
- Drawer slides in → user stays in context
- Cross-sells visible without scrolling

### C. Checkout Popup (Not Checkout Page)
- Modal overlay → user never "leaves" the site
- Feels lighter than a dedicated checkout page
- Reduces perceived commitment

### D. Phone Validation UX
- Real-time validation as user types
- Green checkmark when valid
- Auto-strip spaces and dashes
- Show format hint: "06XXXXXXXX"
- Numeric keyboard on mobile (`inputmode="numeric"`)

---

## 6. Cross-Selling & Upselling

### A. In Cart Drawer
- **Upgrade prompt**: If Pack 4 → "غيّري لباك 6 بغير 80 DH إضافية"
- **Color addition**: "أضيفي لون ثاني لصالون آخر"
- **Bundle**: "أضيفي باك غرفة النوم — خصم خاص"

### B. On Thank You Page
- "خصم 10% على طلبك القادم — الكود: MERCI10"
- "شاركي مع صديقاتك وربحي توصيل مجاني"

### C. Exit Intent Popup
When user moves mouse toward browser close/back (desktop) or after 45 seconds of inactivity (mobile):
```
┌─────────────────────────────┐
│  ✋ استنّي!                    │
│                             │
│  خصم خاص ليك فقط:           │
│  ──────────────────         │
│  وفّري 30 DH على أي باك    │
│                             │
│  الكود: ELORIA30            │
│                             │
│  [🛒 استفيدي من العرض]      │
│  [لا شكراً]                 │
└─────────────────────────────┘
```

---

## 7. Mobile Optimization

### A. Sticky CTA Bar
- Fixed at bottom of viewport on mobile
- Shows: Pack price + "أضف للسلة"
- Always visible while scrolling product page
- Height: 64px, with shadow

### B. Thumb-Friendly Design
- All buttons: min height 48px
- Color swatches: 40px × 40px with ample spacing
- Navigation: bottom-oriented where possible

### C. Fast Loading
- Image lazy loading (below fold)
- Skeleton screens while loading
- Optimize images: WebP format, responsive sizes
- Defer all tracking scripts 1.5-2.5s
- Target: < 2s LCP on 4G

### D. Scroll-Triggered Elements
- Sticky CTA appears after scrolling past the main CTA
- "Return to top" button after scrolling down
- Social proof toasts appear after 5 seconds on page

---

## 8. Trust Building (Moroccan Market Specific)

### A. COD Badge (Biggest Trust Signal)
```
💳 الدفع عند الاستلام — ما تخلصي حتى توصلك الطلبية
```
- Show prominently on every page
- In header, product page, cart, checkout
- This is THE conversion driver in Morocco

### B. WhatsApp Accessibility
- Floating WhatsApp button on every page
- "تواصل معنا على WhatsApp" in footer
- "عندك سؤال؟ راسلنا" near CTA buttons
- Moroccan customers trust businesses they can WhatsApp

### C. Moroccan Cities
- Mention specific Moroccan cities in reviews
- "توصيل لجميع مدن المغرب" with city list
- "أكثر من 50,000 عائلة في 48 ولاية"

### D. Arabic-First
- All content in Darija (Moroccan Arabic)
- RTL layout
- Arabic numbers where appropriate
- Prices in DH (درهم)

---

## 9. Page-Specific CRO Elements

### Homepage
- [ ] Hero with single CTA
- [ ] Pain → Solution flow
- [ ] 3 pack cards with anchoring
- [ ] Review carousel (8+ reviews)
- [ ] Trust badges grid
- [ ] How it works (3 steps)
- [ ] Comparison table
- [ ] FAQ accordion
- [ ] Final CTA with urgency

### Product Page
- [ ] Gallery with zoom
- [ ] Color swatches
- [ ] Pack selector with price anchoring
- [ ] Sticky mobile CTA
- [ ] Countdown timer
- [ ] Live viewers
- [ ] Trust badges
- [ ] Alternating content sections
- [ ] Reviews
- [ ] Cross-sells

### Cart Drawer
- [ ] Clear item list
- [ ] Upgrade/cross-sell cards
- [ ] Free shipping confirmation
- [ ] COD badge
- [ ] Single CTA to checkout

### Checkout Popup
- [ ] Order summary
- [ ] Social proof bar
- [ ] Scarcity number
- [ ] 2 fields only
- [ ] Prominent CTA
- [ ] Trust footer

### Thank You Page
- [ ] Success animation
- [ ] Order details
- [ ] Next steps
- [ ] Cross-sell with discount code
- [ ] Social share buttons

---

## 10. AOV (Average Order Value) Boosters

| Tactic | Expected AOV Impact |
|--------|---------------------|
| Default to Pack 6 (not Pack 4) | +20% |
| Show Pack 9 as "best value" with gold badge | +15% |
| Cross-sell in cart drawer | +10% |
| "أضيفي لون ثاني" suggestion | +25% |
| Discount code on Thank You page for repeat | +5% (LTV) |
| Exit popup with discount | Recover 3-5% lost orders |

### Default Selection Strategy
- On product page, **pre-select Pack 6** (not Pack 4)
- This uses the anchoring bias: Pack 4 seems too little, Pack 9 seems like a great deal
- Most users will stay with Pack 6 or upgrade to Pack 9
