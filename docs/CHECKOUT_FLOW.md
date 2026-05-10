# CHECKOUT FLOW — Maison Eloria

## Overview

The purchase flow is designed to minimize friction and maximize conversion for Moroccan COD (Cash on Delivery) buyers. Only 2 form fields. No account creation. No email required.

```
Product Page → Add to Cart → Cart Drawer (with cross-sells)
                                    ↓
                          Checkout Popup (modal)
                                    ↓
                          Thank You Page + Google Sheets + Tracking
```

---

## Step 1: Product Page CTA

### Desktop
- Large "🛒 أضف للسلة" button
- Color selector must be chosen first
- Pack must be selected (default: Pack 6 — most popular)

### Mobile
- Sticky bottom CTA bar (always visible)
- Shows selected pack price + "أضف للسلة"
- Slides up with shadow on scroll

### Behavior on Click
1. Add item to cart (stored in localStorage + Zustand state)
2. Show success toast: "✅ تمت الإضافة للسلة"
3. Cart icon in header bounces + count updates
4. Auto-open Cart Drawer after 500ms delay

---

## Step 2: Cart Drawer

### Trigger
- Click cart icon in header
- Auto-opens after Add to Cart

### Layout
- Slide-in from left (RTL) with backdrop overlay
- Width: 400px desktop, full-width mobile

### Content

#### Header
- "سلة المشتريات (X)" with close button

#### Cart Items
For each item:
```
[Image] [Color Name]
        [Pack Name — X قطع]
        [Price: XXX DH]
        [Quantity: - 1 +]  [🗑️ حذف]
```

#### Cross-Sell Section
- Heading: "🎯 أكملي صالونك"
- Show 2-3 cards based on logic:
  - If Pack 4 in cart → Show "غيّري لباك 6 ووفّري أكثر" upgrade card
  - If 1 color in cart → Show complementary color suggestion
  - Always show: "أضيفي مجموعة لغرفة أخرى"

#### Cart Summary
```
المجموع الفرعي:    XXX DH
التوصيل:           مجاني 🎉
─────────────────────────
المجموع:           XXX DH
```

#### Trust Badges
- 💳 "الدفع عند الاستلام"
- 🚚 "توصيل مجاني"
- ✅ "ضمان 30 يوم"

#### CTA
- Large button: "إتمام الطلب →"
- Clicking opens Checkout Popup

---

## Step 3: Checkout Popup

### Trigger
- Click "إتمام الطلب" from Cart Drawer

### Layout
- Modal overlay with backdrop blur (dark 50% opacity)
- Centered card: max-width 480px
- Rounded corners, shadow-modal
- Close X button top-left (RTL)
- Cannot scroll behind (body scroll lock)

### Content Structure

#### 1. Order Summary (Top)
```
ملخص الطلب
──────────────────
[img] غطاء كرسي — بيج (باك 6)     330 DH
[img] غطاء كرسي — بني (باك 4)      250 DH
──────────────────
المجموع:                           580 DH
التوصيل:                           مجاني ✅
──────────────────
الإجمالي:                          580 DH
```

#### 2. Social Proof Bar
```
🔒 طلب آمن  |  ✅ 2,847+ عملية شراء ناجحة  |  ⭐ 4.8/5
```

#### 3. Scarcity Indicator
```
⚡ 12 شخص آخر يطلبون نفس المنتج الآن
```
(Random number between 5-25, changes every 30 seconds)

#### 4. Checkout Form (2 fields ONLY)

**Field 1: الاسم الكامل**
```
<input type="text" placeholder="الاسم الكامل" required />
```
- Validation: minimum 3 characters, Arabic or Latin characters
- Error: "المرجو إدخال الاسم الكامل"

**Field 2: رقم الهاتف**
```
<input type="tel" placeholder="06XXXXXXXX" required />
```
- **Validation rules**:
  - Must be exactly 10 digits
  - Must start with `06` or `07`
  - Regex: `^(06|07)\d{8}$`
  - Strip spaces and dashes before validation
- **Real-time validation**: Show green checkmark when valid
- Error: "المرجو إدخال رقم هاتف مغربي صحيح"
- Auto-focus after name field

#### 5. CTA Button
```
✅ تأكيد الطلب — الدفع عند الاستلام
```
- Full-width, large (py-4)
- Background: brand-600 (or gold gradient for best value pack)
- Disabled until both fields are valid
- Loading spinner on submit

#### 6. Trust Footer
```
🚚 توصيل مجاني خلال 2-4 أيام عمل
💳 لا حاجة لبطاقة بنكية — ادفع عند الاستلام
```

---

## Step 4: Order Submission

### On Form Submit

1. **Validate inputs** (client-side)
2. **Show loading state** (spinner on CTA, disable form)
3. **Send to Backend API**:
   ```
   POST https://api.maisoneloria.shop/api/orders
   Content-Type: application/json
   
   {
     "customer_name": "سارة الحسني",
     "customer_phone": "0661234567",
     "items": [
       {
         "pack_id": "pack_6",
         "color_id": "beige",
         "quantity": 1,
         "price": 330
       }
     ],
     "total": 330,
     "utm_source": "facebook",
     "utm_medium": "cpc",
     "utm_campaign": "pack-famille",
     "fbclid": "abc123...",
     "ttclid": "xyz789...",
     "sclid": "snap456...",
     "fb_event_id": "evt_123",
     "user_agent": "Mozilla/5.0...",
     "page_url": "https://maisoneloria.shop/product/housse-chaise-beige"
   }
   ```

4. **Backend processes**:
   - Validate phone (Moroccan format)
   - MaxMind fraud check (IP → Morocco, not VPN)
   - Generate order number (ELO-XXXX)
   - Save to PostgreSQL
   - Send to Google Sheets
   - Fire server-side tracking events (CAPI)
   - Return order confirmation

5. **On success**:
   - Clear cart
   - Redirect to `/thank-you?order=ELO-XXXX`
   - Fire client-side Purchase events

6. **On failure**:
   - Show error message in popup
   - Don't clear form
   - Allow retry

### Phone Number Formatting for APIs

| API | Format Required | Example |
|-----|----------------|---------|
| Database | As entered | `0661234567` |
| Google Sheets | As entered | `0661234567` |
| Facebook CAPI | E.164 with country code | `+212661234567` |
| TikTok CAPI | E.164 with "+" prefix | `+212661234567` |
| Snapchat CAPI | E.164 | `+212661234567` |

### Phone Conversion Logic
```
Input: "0661234567"
→ Strip leading 0: "661234567"
→ Add country code: "+212661234567"
→ For hashing: sha256("+212661234567")
```

---

## Step 5: Thank You Page

### URL
`/thank-you?order=ELO-XXXX`

### Content
1. **Success animation**: Large green checkmark (Lottie or CSS)
2. **Heading**: "🎉 شكراً لك! تم تسجيل طلبك بنجاح"
3. **Order number**: "رقم الطلب: ELO-XXXX" (copyable)
4. **Order details**: Summary of what was ordered
5. **Next steps**:
   - "سيتواصل معك فريقنا عبر WhatsApp لتأكيد الطلب"
   - "مدة التوصيل: 2-4 أيام عمل"
6. **WhatsApp CTA**: "تواصل معنا على WhatsApp" → wa.me link
7. **Cross-sell**: "خصم 10% على طلبك القادم — الكود: MERCI10"
8. **Social share buttons**: Share on WhatsApp, Facebook

---

## Cart State Management

### Storage
- **Primary**: Zustand store (in-memory, reactive)
- **Persistence**: localStorage (survives page refresh)
- **Key**: `eloria_cart`

### Cart Schema
```typescript
interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

interface CartItem {
  packId: string;
  packName: string;
  colorId: string;
  colorName: string;
  colorHex: string;
  pieces: number;
  price: number;
  quantity: number;
}
```

### Rules
- Max 10 items in cart
- Same pack+color combination increments quantity (don't add duplicate)
- Cart persists across sessions
- Cart clears after successful order

---

## Error States

### Network Error
- "⚠️ حدث خطأ في الاتصال. حاول مرة أخرى."
- Retry button

### Fraud Blocked
- Don't tell user it's fraud
- Show: "⚠️ عذراً، لا يمكن معالجة طلبك حالياً. تواصل معنا على WhatsApp"
- Provide WhatsApp link

### Invalid Phone
- Inline error: "المرجو إدخال رقم هاتف مغربي صحيح (06 أو 07)"

### Server Error
- "⚠️ حدث خطأ. يرجى المحاولة لاحقاً أو التواصل معنا على WhatsApp"
