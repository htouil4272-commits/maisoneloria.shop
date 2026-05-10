# DESIGN SYSTEM — Maison Eloria

## Brand Identity

### Logo
- **Icon**: Letter "M" inside a circle with brand primary color
- **Text**: "Maison Eloria" in Playfair Display (serif, elegant)
- **Arabic variant**: "ميزون إلوريا" in Cairo Bold
- **Placement**: Icon on the right (RTL), text logo next to it
- **Minimum size**: 32px height for icon

### Logo Usage
```
[M]  Maison Eloria          ← Desktop header
[M]  ميزون إلوريا           ← Arabic variant
[M]                          ← Mobile (icon only)
```

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Emerald Deep** | `#1B4332` | Primary brand, headers, CTA backgrounds |
| **Emerald** | `#2D6A4F` | Hover states, secondary elements |
| **Emerald Light** | `#40916C` | Accents, links |

### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Gold** | `#C9A84C` | Premium accents, badges, "best offer" |
| **Gold Light** | `#E8D5A3` | Subtle highlights, backgrounds |

### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Charcoal** | `#1A1A1A` | Primary text |
| **Gray 700** | `#374151` | Secondary text |
| **Gray 400** | `#9CA3AF` | Placeholder text |
| **Gray 200** | `#E5E7EB` | Borders, dividers |
| **Gray 100** | `#F3F4F6` | Section backgrounds |
| **Cream** | `#FAF7F2` | Page background (warm) |
| **White** | `#FFFFFF` | Cards, overlays |

### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#059669` | In stock, success messages |
| **Warning** | `#D97706` | Low stock, urgency |
| **Error** | `#DC2626` | Form errors, out of stock |
| **Info** | `#2563EB` | Informational badges |

### Tailwind Config
```js
colors: {
  brand: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#40916C',
    500: '#2D6A4F',
    600: '#1B4332',
    700: '#14532D',
    800: '#0F3D22',
    900: '#052E16',
  },
  gold: {
    300: '#E8D5A3',
    400: '#D4B96A',
    500: '#C9A84C',
    600: '#B8942F',
  },
  cream: '#FAF7F2',
}
```

---

## Typography

### Font Stack
- **Headings**: `Playfair Display` (serif) — elegant, premium feel
- **Body (Arabic)**: `Cairo` (sans-serif) — optimized for Arabic readability
- **Body (French/numbers)**: `Inter` (sans-serif) — clean, modern
- **Monospace** (prices): `JetBrains Mono` — prices stand out

### Google Fonts Import
```
Cairo:wght@400;500;600;700
Playfair+Display:wght@400;600;700
Inter:wght@400;500;600;700
```

### Type Scale
| Element | Size (mobile) | Size (desktop) | Weight | Font |
|---------|--------------|----------------|--------|------|
| H1 (Hero) | 28px / 1.75rem | 48px / 3rem | 700 | Playfair Display |
| H2 (Section) | 24px / 1.5rem | 36px / 2.25rem | 700 | Cairo |
| H3 (Card) | 20px / 1.25rem | 24px / 1.5rem | 600 | Cairo |
| Body | 16px / 1rem | 16px / 1rem | 400 | Cairo |
| Body Large | 18px / 1.125rem | 20px / 1.25rem | 400 | Cairo |
| Small | 14px / 0.875rem | 14px / 0.875rem | 400 | Cairo |
| Caption | 12px / 0.75rem | 12px / 0.75rem | 500 | Cairo |
| Price | 24px / 1.5rem | 32px / 2rem | 700 | Inter |
| Price Old | 16px / 1rem | 18px / 1.125rem | 400 | Inter (strikethrough) |

### Line Heights
- Headings: 1.2
- Body: 1.6
- Arabic text: 1.8 (extra space for readability)

---

## Spacing System

Using Tailwind's default 4px grid:
- `xs`: 4px (p-1)
- `sm`: 8px (p-2)
- `md`: 16px (p-4)
- `lg`: 24px (p-6)
- `xl`: 32px (p-8)
- `2xl`: 48px (p-12)
- `3xl`: 64px (p-16)
- `section-y`: 80px (py-20) mobile, 120px (py-30) desktop

---

## Border Radius
| Element | Radius |
|---------|--------|
| Buttons | 8px (rounded-lg) |
| Cards | 12px (rounded-xl) |
| Modals/Drawers | 16px (rounded-2xl) on top |
| Images | 12px (rounded-xl) |
| Badges | 9999px (rounded-full) |
| Inputs | 8px (rounded-lg) |

---

## Shadows
```css
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
shadow-card: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)
shadow-elevated: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)
shadow-modal: 0 25px 50px -12px rgba(0,0,0,0.15)
```

---

## Components

### Buttons

#### Primary CTA (Add to Cart / Commander)
```
bg-brand-600 text-white hover:bg-brand-700
px-8 py-4 rounded-lg font-bold text-lg
transition-all duration-200
shadow-lg hover:shadow-xl
```

#### Secondary
```
bg-white text-brand-600 border-2 border-brand-600
hover:bg-brand-50
px-6 py-3 rounded-lg font-semibold
```

#### Gold (Best Offer)
```
bg-gradient-to-r from-gold-500 to-gold-600
text-white font-bold
px-8 py-4 rounded-lg
animate-subtle-pulse
```

### Cards
```
bg-white rounded-xl shadow-card
hover:shadow-elevated
transition-shadow duration-300
overflow-hidden
```

### Trust Badge
```
inline-flex items-center gap-2
bg-brand-50 text-brand-600
px-3 py-1.5 rounded-full
text-sm font-medium
```

### Input Fields
```
w-full px-4 py-3 rounded-lg
border border-gray-200
focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
text-right (RTL)
placeholder:text-gray-400
```

---

## Layout

### RTL (Right-to-Left)
- All pages render RTL by default (Arabic)
- `dir="rtl"` on `<html>`
- Use Tailwind RTL utilities: `rtl:`, `ltr:`
- Flex items reverse: `flex-row-reverse` where needed

### Container
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Grid
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

### Header
- Height: 64px mobile, 72px desktop
- Sticky on scroll
- Backdrop blur
- Right: Logo (M icon + text)
- Center: Nav links (desktop)
- Left: Cart icon with badge count

### Footer
- Dark background (`bg-brand-600`)
- 4-column grid on desktop
- Brand info, links, contact, social
- Payment/trust badges at bottom

---

## Animations

### Page Transitions
- Fade in on route change (300ms)

### Scroll Reveal
- Elements fade up on scroll
- `opacity: 0, translateY: 20px` → `opacity: 1, translateY: 0`
- Duration: 600ms, easing: ease-out
- Stagger children by 100ms

### Micro-interactions
- Button hover: scale(1.02) + shadow increase
- Card hover: translateY(-4px) + shadow increase
- Cart icon: bounce when item added
- Heart/review: scale pulse on interaction

### Loading States
- Skeleton screens for images
- Spinner for checkout submission
- Progress bar for multi-step (if any)

---

## Product Color Swatches

The 9 chair cover colors:

| Name (AR) | Name (FR) | Hex | Swatch |
|------------|-----------|-----|--------|
| بيج | Beige | `#D4C5A9` | Warm beige |
| رمادي | Gris | `#8E8E8E` | Medium gray |
| بني | Marron | `#6B4226` | Rich brown |
| أسود | Noir | `#2C2C2C` | Deep black |
| أبيض | Blanc | `#F5F5F0` | Off-white |
| أحمر نبيذي | Bordeaux | `#722F37` | Wine red |
| أزرق بحري | Bleu Marine | `#1B3A5C` | Navy blue |
| أخضر زيتوني | Vert Olive | `#556B2F` | Olive green |
| كريمي | Crème | `#FFFDD0` | Cream yellow |

### Swatch Component
- 32x32px circles on mobile, 40x40px on desktop
- `ring-2 ring-offset-2 ring-brand-600` when selected
- Tooltip showing color name on hover
- Checkmark icon inside when selected

---

## Iconography

Use **Lucide React** icons throughout:
- `ShoppingCart` — Cart
- `Check` — Checkmarks, verification
- `Shield` — Trust, guarantee
- `Truck` — Free shipping
- `Star` — Reviews
- `Clock` — Urgency, countdown
- `Phone` — WhatsApp, contact
- `ChevronRight` / `ChevronLeft` — Navigation (RTL aware)
- `X` — Close modals/drawers
- `Plus` / `Minus` — Quantity controls
- `Heart` — Wishlist (optional)
- `Eye` — Live viewers

---

## Responsive Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Mobile-First Priority
1. Design for 375px width first
2. Test on 390px (iPhone 14/15)
3. Tablet (768px) second
4. Desktop (1280px) last
