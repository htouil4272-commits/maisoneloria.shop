// Maison Eloria — توليد رسومات SVG برسم احترافي وموحّد
// كل الرسومات تستعمل لوحة العلامة (أخضر داكن + ذهبي + كريمي)
// لتعويض الصور الفوتوغرافية الحقيقية حتى تتوفر.

import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'images');

const brand = {
  primary: '#1B4332',
  primaryDark: '#143326',
  gold: '#C9A84C',
  goldLight: '#E2C879',
  cream: '#FAF7F2',
  creamDark: '#EFE8DC',
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const defsCommon = `
  <defs>
    <linearGradient id="creamBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${brand.cream}"/>
      <stop offset="100%" stop-color="${brand.creamDark}"/>
    </linearGradient>
    <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${brand.goldLight}"/>
      <stop offset="100%" stop-color="${brand.gold}"/>
    </linearGradient>
    <linearGradient id="primaryDeep" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${brand.primary}"/>
      <stop offset="100%" stop-color="${brand.primaryDark}"/>
    </linearGradient>
    <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.18"/>
    </filter>
    <filter id="softer" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
  </defs>`;

/** كرسي مغطى بقماش — يستعمل في عدّة لقطات (مقاس قابل للتحجيم) */
function chairGroup(fill, { x = 0, y = 0, scale = 1, ink = brand.primary, label = '' } = {}) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})" aria-label="${label}">
    <!-- ظل أرضي -->
    <ellipse cx="0" cy="252" rx="138" ry="14" fill="#000" opacity="0.10"/>
    <!-- مسند ظهر مغطى بنعومة طي القماش -->
    <path filter="url(#soft)" fill="${fill}" stroke="${ink}" stroke-width="2"
      d="M -132 -120 C -132 -160 132 -160 132 -120 L 122 38 C 122 52 108 60 92 60 L -92 60 C -108 60 -122 52 -122 38 Z"/>
    <!-- خطوط طي عمودية على الظهر -->
    <path d="M -78 -116 L -82 50  M 0 -130 L 0 56  M 78 -116 L 82 50"
      fill="none" stroke="${ink}" stroke-opacity="0.16" stroke-width="1.4"/>
    <!-- خياطة ذهبية على الحدّ -->
    <path d="M -130 -116 C -130 -154 130 -154 130 -116" fill="none"
      stroke="url(#goldShine)" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.55"/>
    <!-- المقعد -->
    <path filter="url(#soft)" fill="${fill}" stroke="${ink}" stroke-width="2"
      d="M -132 52 L 132 52 L 162 102 C 166 122 148 138 120 138 L -120 138 C -148 138 -166 122 -162 102 Z"/>
    <!-- التواء القماش على الجبهة -->
    <path d="M -150 110 Q 0 156 150 110" fill="none" stroke="${ink}" stroke-opacity="0.22" stroke-width="1.4"/>
    <!-- الأرجل الخشبية -->
    <g stroke="#3d2a1f" stroke-width="1">
      <path fill="#6b4e3d" d="M -110 138 L -120 232 L -98 232 L -90 138 Z"/>
      <path fill="#6b4e3d" d="M -34 138 L -42 232 L -20 232 L -12 138 Z"/>
      <path fill="#6b4e3d" d="M 22 138 L 16 232 L 38 232 L 46 138 Z"/>
      <path fill="#6b4e3d" d="M 100 138 L 90 232 L 112 232 L 122 138 Z"/>
    </g>
  </g>`;
}

/* ------------------------------------------------------------------ */
/* Product (single chair, hero shot)                                   */
/* ------------------------------------------------------------------ */

function productSvg(fill, labelAr) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="غطاء كرسي ميزون إلوريا — ${labelAr}">
  ${defsCommon}
  <rect width="600" height="600" fill="url(#creamBg)"/>
  <!-- خلفية ذهبية ناعمة -->
  <circle cx="300" cy="270" r="220" fill="url(#goldShine)" opacity="0.10"/>
  <!-- علامة مائية صغيرة -->
  <text x="300" y="38" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="14" letter-spacing="6" fill="${brand.primary}" opacity="0.45">MAISON ELORIA</text>
  ${chairGroup(fill, { x: 300, y: 320, scale: 1.0, label: `كرسي بغطاء ${labelAr}` })}
  <!-- اسم اللون -->
  <text x="300" y="572" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="22" font-weight="700" fill="${brand.primary}">${labelAr}</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Hero banner (used as fallback for hero/moroccan salon)              */
/* ------------------------------------------------------------------ */

function heroSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" role="img" aria-label="صالون مغربي مع أغطية كراسي ميزون إلوريا">
  ${defsCommon}
  <!-- جدار -->
  <rect width="1600" height="900" fill="url(#primaryDeep)"/>
  <!-- نقش زليج خفيف -->
  <g opacity="0.06" fill="${brand.gold}">
    ${Array.from({ length: 8 }).map((_, r) => Array.from({ length: 14 }).map((_, c) => {
      const x = 80 + c * 110; const y = 80 + r * 110;
      return `<path d="M ${x} ${y - 18} L ${x + 18} ${y} L ${x} ${y + 18} L ${x - 18} ${y} Z"/>`;
    }).join('')).join('')}
  </g>
  <!-- قوس مغربي -->
  <path d="M 1080 760 L 1080 380 C 1080 220 1380 220 1380 380 L 1380 760 Z"
    fill="${brand.cream}" opacity="0.05" stroke="url(#goldShine)" stroke-width="2"/>
  <!-- أرضية -->
  <rect x="0" y="700" width="1600" height="200" fill="#0e2419"/>
  <line x1="0" y1="710" x2="1600" y2="710" stroke="url(#goldShine)" stroke-width="1.5" opacity="0.3"/>
  <!-- مجموعة كراسي -->
  ${chairGroup('#D4C5A9', { x: 380, y: 600, scale: 0.85, label: 'كرسي بيج' })}
  ${chairGroup('#722F37', { x: 760, y: 580, scale: 1.0, label: 'كرسي بوردو' })}
  ${chairGroup('#1B3A5C', { x: 1180, y: 600, scale: 0.85, label: 'كرسي أزرق بحري' })}
  <!-- نص -->
  <text x="80" y="220" font-family="'Playfair Display', Georgia, serif" font-size="84" font-weight="700"
    fill="${brand.cream}">Maison Eloria</text>
  <text x="80" y="280" font-family="'Inter', sans-serif" font-size="22" letter-spacing="6"
    fill="url(#goldShine)">L'ART DE VIVRE • MAROC</text>
  <line x1="80" y1="306" x2="240" y2="306" stroke="url(#goldShine)" stroke-width="2"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Moroccan Salon scene                                                */
/* ------------------------------------------------------------------ */

function salonSvg(accent = '#D4C5A9') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" role="img" aria-label="صالون مغربي أنيق">
  ${defsCommon}
  <!-- جدار كريمي مع لمسة أخضر -->
  <rect width="1600" height="900" fill="${brand.cream}"/>
  <!-- لوحة جدارية -->
  <rect x="120" y="120" width="200" height="280" rx="12" fill="${brand.creamDark}" stroke="url(#goldShine)" stroke-width="2"/>
  <rect x="140" y="140" width="160" height="220" rx="8" fill="${brand.primary}" opacity="0.18"/>
  <!-- ستائر / إطار قوسي -->
  <path d="M 1100 100 L 1100 520 C 1100 340 1480 340 1480 520 L 1480 100 Z"
    fill="${brand.primary}" opacity="0.06" stroke="url(#goldShine)" stroke-width="1.5"/>
  <!-- نبات داخلي -->
  <ellipse cx="1380" cy="600" rx="48" ry="14" fill="#000" opacity="0.1"/>
  <rect x="1340" y="500" width="80" height="100" rx="8" fill="${brand.creamDark}" stroke="${brand.primary}" stroke-opacity="0.2"/>
  <g fill="${brand.primary}" opacity="0.85">
    <ellipse cx="1380" cy="490" rx="50" ry="80"/>
    <ellipse cx="1340" cy="470" rx="36" ry="50"/>
    <ellipse cx="1420" cy="470" rx="36" ry="50"/>
  </g>
  <!-- أرضية -->
  <rect x="0" y="700" width="1600" height="200" fill="${brand.creamDark}"/>
  <!-- زليج صغير على الأرضية -->
  <g opacity="0.18">
    ${Array.from({ length: 16 }).map((_, c) => `<path d="M ${100 + c * 100} 720 L ${150 + c * 100} 720" stroke="${brand.gold}" stroke-width="0.8"/>`).join('')}
  </g>
  <!-- طاولة قهوة -->
  <ellipse cx="800" cy="690" rx="170" ry="24" fill="${brand.primary}" opacity="0.15"/>
  <rect x="660" y="620" width="280" height="20" rx="4" fill="#5b3d2a"/>
  <rect x="700" y="640" width="200" height="50" fill="#3d2a1f"/>
  <!-- إبريق شاي ذهبي -->
  <g transform="translate(780, 590)">
    <path d="M 0 0 C -20 0 -28 12 -28 26 C -28 40 -16 50 0 50 C 16 50 28 40 28 26 C 28 12 20 0 0 0 Z" fill="url(#goldShine)" stroke="${brand.primary}"/>
    <rect x="-4" y="-12" width="8" height="14" fill="url(#goldShine)" stroke="${brand.primary}"/>
  </g>
  <!-- كرسيان -->
  ${chairGroup(accent, { x: 480, y: 610, scale: 0.95 })}
  ${chairGroup(accent, { x: 1120, y: 610, scale: 0.95 })}
  <!-- علامة مائية -->
  <text x="800" y="60" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="22" letter-spacing="8" fill="${brand.primary}" opacity="0.4">MAISON ELORIA</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Lifestyle (single chair in a corner)                                */
/* ------------------------------------------------------------------ */

function lifestyleSvg(accent = '#D4C5A9') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" role="img" aria-label="ركن أنيق في صالون">
  ${defsCommon}
  <rect width="1200" height="800" fill="url(#creamBg)"/>
  <!-- ظل جدار -->
  <rect x="0" y="0" width="600" height="800" fill="${brand.primary}" opacity="0.05"/>
  <!-- إطار جدار -->
  <rect x="120" y="120" width="320" height="380" rx="14" fill="none" stroke="url(#goldShine)" stroke-width="2"/>
  <rect x="160" y="160" width="240" height="300" rx="8" fill="${brand.primary}" opacity="0.10"/>
  <!-- مصباح -->
  <line x1="900" y1="80" x2="900" y2="280" stroke="${brand.primary}" stroke-width="2"/>
  <ellipse cx="900" cy="320" rx="80" ry="40" fill="url(#goldShine)" opacity="0.6" stroke="${brand.primary}"/>
  <!-- أرضية + سجاد -->
  <rect x="0" y="640" width="1200" height="160" fill="${brand.creamDark}"/>
  <ellipse cx="700" cy="700" rx="380" ry="40" fill="${brand.gold}" opacity="0.18"/>
  <!-- كرسي -->
  ${chairGroup(accent, { x: 700, y: 540, scale: 1.1 })}
  <!-- وسادة على الكرسي -->
  <rect x="640" y="500" width="120" height="40" rx="10" fill="url(#goldShine)" opacity="0.85" stroke="${brand.primary}"/>
  <text x="600" y="60" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="18" letter-spacing="6" fill="${brand.primary}" opacity="0.4">MAISON ELORIA</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Before / After                                                      */
/* ------------------------------------------------------------------ */

function beforeAfterSvg() {
  // بديل لكرسيغير ملوّن ومُتعب
  const wornChair = `
    <g transform="translate(280,420) scale(0.85)">
      <ellipse cx="0" cy="252" rx="120" ry="12" fill="#000" opacity="0.08"/>
      <path fill="#a89578" stroke="#5b3d2a" stroke-width="1.5"
        d="M -120 -120 C -120 -160 120 -160 120 -120 L 116 40 C 116 56 100 64 84 64 L -84 64 C -100 64 -116 56 -116 40 Z"/>
      <!-- بقع وتآكل -->
      <ellipse cx="-40" cy="-50" rx="20" ry="14" fill="#705c3f" opacity="0.4"/>
      <ellipse cx="50" cy="-10" rx="14" ry="10" fill="#705c3f" opacity="0.5"/>
      <path d="M -100 -50 Q -90 -48 -85 -45" fill="none" stroke="#5b3d2a" stroke-width="0.8"/>
      <path d="M 80 0 Q 90 4 96 8" fill="none" stroke="#5b3d2a" stroke-width="0.8"/>
      <path fill="#a89578" stroke="#5b3d2a" stroke-width="1.5"
        d="M -120 56 L 120 56 L 148 102 C 152 122 134 138 108 138 L -108 138 C -134 138 -152 122 -148 102 Z"/>
      <g stroke="#3d2a1f" stroke-width="1">
        <path fill="#6b4e3d" d="M -100 138 L -110 232 L -88 232 L -80 138 Z"/>
        <path fill="#6b4e3d" d="M -28 138 L -36 232 L -14 232 L -6 138 Z"/>
        <path fill="#6b4e3d" d="M 18 138 L 12 232 L 34 232 L 42 138 Z"/>
        <path fill="#6b4e3d" d="M 90 138 L 80 232 L 102 232 L 114 138 Z"/>
      </g>
    </g>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600" role="img" aria-label="مقارنة قبل وبعد">
  ${defsCommon}
  <rect width="1200" height="600" fill="url(#creamBg)"/>
  <!-- نصفي الإطار -->
  <rect x="0" y="0" width="600" height="600" fill="${brand.primary}" opacity="0.05"/>
  <line x1="600" y1="40" x2="600" y2="560" stroke="url(#goldShine)" stroke-width="2"/>
  <!-- شارات -->
  <rect x="40" y="40" width="120" height="36" rx="18" fill="#b85a5a"/>
  <text x="100" y="64" text-anchor="middle" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="#fff">قبل</text>
  <rect x="1040" y="40" width="120" height="36" rx="18" fill="${brand.primary}"/>
  <text x="1100" y="64" text-anchor="middle" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="url(#goldShine)">بعد</text>
  <!-- كرسي قديم على اليسار -->
  ${wornChair}
  <!-- كرسي محسّن على اليمين -->
  ${chairGroup('#D4C5A9', { x: 920, y: 420, scale: 0.85 })}
  <!-- شارة لمسة -->
  <g transform="translate(940, 200)">
    <circle r="56" fill="url(#goldShine)"/>
    <text y="-2" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="${brand.primary}">تحوّل</text>
    <text y="18" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="${brand.primary}">ف 60s</text>
  </g>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Fabric closeup                                                      */
/* ------------------------------------------------------------------ */

function fabricSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img" aria-label="قماش مطاطي عالي الجودة عن قرب">
  ${defsCommon}
  <defs>
    <pattern id="weave" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="14" height="14" fill="#E0CFA7"/>
      <path d="M 0 7 L 14 7" stroke="#B89968" stroke-width="2"/>
      <path d="M 7 0 L 7 14" stroke="#B89968" stroke-width="2"/>
      <path d="M 0 0 L 14 14" stroke="#A88330" stroke-width="0.8" opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="800" height="800" fill="${brand.cream}"/>
  <rect x="60" y="60" width="680" height="680" rx="18" fill="url(#weave)" stroke="url(#goldShine)" stroke-width="3"/>
  <!-- ظلال نسيج -->
  <rect x="60" y="60" width="680" height="680" rx="18" fill="url(#goldShine)" opacity="0.06"/>
  <!-- تكبير -->
  <g transform="translate(540, 540)">
    <circle r="120" fill="${brand.cream}" stroke="url(#goldShine)" stroke-width="3" filter="url(#soft)"/>
    <circle r="100" fill="url(#weave)"/>
    <line x1="0" y1="0" x2="100" y2="100" stroke="${brand.primary}" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
  </g>
  <text x="400" y="780" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="22" font-weight="700" fill="${brand.primary}">قماش مطاطي بنسج فرنسي 4 اتجاهات</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Packaging                                                           */
/* ------------------------------------------------------------------ */

function packagingSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="تغليف فاخر">
  ${defsCommon}
  <rect width="800" height="600" fill="url(#creamBg)"/>
  <!-- ظل أرضي -->
  <ellipse cx="400" cy="500" rx="240" ry="18" fill="#000" opacity="0.10"/>
  <!-- صندوق -->
  <g filter="url(#soft)">
    <path d="M 200 240 L 600 240 L 660 320 L 660 480 L 140 480 L 140 320 Z"
      fill="url(#primaryDeep)"/>
    <path d="M 200 240 L 600 240 L 660 320 L 140 320 Z" fill="${brand.primary}"/>
    <path d="M 600 240 L 660 320 L 660 480 L 600 400 Z" fill="${brand.primaryDark}"/>
  </g>
  <!-- شريط ذهبي -->
  <rect x="380" y="240" width="40" height="240" fill="url(#goldShine)"/>
  <rect x="140" y="350" width="520" height="20" fill="url(#goldShine)" opacity="0.95"/>
  <!-- عقدة -->
  <g transform="translate(400, 360)">
    <ellipse cx="-22" cy="0" rx="40" ry="22" fill="url(#goldShine)" stroke="${brand.primary}" stroke-width="0.8"/>
    <ellipse cx="22" cy="0" rx="40" ry="22" fill="url(#goldShine)" stroke="${brand.primary}" stroke-width="0.8"/>
    <rect x="-10" y="-12" width="20" height="24" fill="${brand.gold}" stroke="${brand.primary}" stroke-width="0.6"/>
  </g>
  <!-- شعار على الصندوق -->
  <text x="400" y="305" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="22" font-weight="700" letter-spacing="6" fill="url(#goldShine)">MAISON ELORIA</text>
  <!-- ورقة شكر صغيرة -->
  <rect x="100" y="140" width="160" height="100" rx="6" fill="#fff" stroke="${brand.gold}" stroke-width="1.5" filter="url(#softer)" transform="rotate(-8 180 190)"/>
  <text x="180" y="180" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="14" fill="${brand.primary}" transform="rotate(-8 180 190)">Merci ❤</text>
  <text x="180" y="200" text-anchor="middle" font-family="'Inter', sans-serif"
    font-size="9" letter-spacing="2" fill="${brand.gold}" transform="rotate(-8 180 190)">— ELORIA</text>
  <text x="400" y="560" text-anchor="middle" font-family="'Inter', sans-serif"
    font-size="13" fill="${brand.primary}" opacity="0.7">تغليف فاخر — مغطى بشريط حريري ذهبي</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Easy installation 3-step                                            */
/* ------------------------------------------------------------------ */

function installSvg() {
  const step = (x, n, title, render) => `
    <g transform="translate(${x}, 200)">
      ${render}
      <circle cx="0" cy="-150" r="22" fill="url(#goldShine)" stroke="${brand.primary}" stroke-width="1.5"/>
      <text y="-145" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
        font-size="20" font-weight="700" fill="${brand.primary}">${n}</text>
      <text y="200" text-anchor="middle" font-family="'Inter', sans-serif"
        font-size="14" font-weight="700" fill="${brand.primary}">${title}</text>
    </g>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 500" width="1100" height="500" role="img" aria-label="ثلاث خطوات للتركيب">
  ${defsCommon}
  <rect width="1100" height="500" fill="url(#creamBg)"/>
  <!-- خط واصل بين الخطوات -->
  <line x1="200" y1="170" x2="900" y2="170" stroke="url(#goldShine)" stroke-width="2" stroke-dasharray="6 6"/>
  ${step(200, '1', 'بسطي الغطاء', `
    <rect x="-72" y="-70" width="144" height="140" rx="10" fill="#D4C5A9" stroke="${brand.primary}" stroke-width="2"/>
    <path d="M -60 0 Q 0 30 60 0" fill="none" stroke="${brand.primary}" stroke-opacity="0.4"/>
  `)}
  ${step(550, '2', 'لبّسيها على الكرسي', `
    <g transform="scale(0.55)">
      ${chairGroup('#D4C5A9', { x: 0, y: 0, scale: 1 })}
    </g>
  `)}
  ${step(900, '3', 'شدّيها من تحت', `
    <g transform="scale(0.55)">
      ${chairGroup('#D4C5A9', { x: 0, y: 0, scale: 1 })}
    </g>
    <text y="124" text-anchor="middle" font-size="22" fill="${brand.primary}">✓</text>
  `)}
  <text x="550" y="60" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="22" font-weight="700" fill="${brand.primary}">تركيب فدقيقة وحدة</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Quality comparison                                                  */
/* ------------------------------------------------------------------ */

function compareSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600" role="img" aria-label="مقارنة الجودة">
  ${defsCommon}
  <rect width="1200" height="600" fill="url(#creamBg)"/>
  <!-- لي كاين فالسوق (يسار) -->
  <rect x="60" y="60" width="520" height="480" rx="18" fill="#fff5f5" stroke="#c94a4a" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="320" y="100" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="22" font-weight="700" fill="#c94a4a">بديل رخيص ✗</text>
  <!-- كرسي مجعّد -->
  <g transform="translate(320, 360) scale(0.65)">
    <ellipse cx="0" cy="252" rx="138" ry="14" fill="#000" opacity="0.10"/>
    <path fill="#c4ad88" stroke="${brand.primary}" stroke-width="1.5"
      d="M -132 -110 C -132 -150 132 -160 132 -120 L 122 38 C 122 52 108 60 92 60 L -92 60 C -108 60 -122 52 -122 38 Z"/>
    <!-- تجاعيد -->
    <path d="M -100 -60 Q -50 -80 0 -50 T 100 -60" fill="none" stroke="${brand.primary}" stroke-opacity="0.4" stroke-width="2"/>
    <path d="M -90 0 Q -30 -20 30 10 T 110 0" fill="none" stroke="${brand.primary}" stroke-opacity="0.4" stroke-width="2"/>
    <path fill="#c4ad88" stroke="${brand.primary}" stroke-width="1.5"
      d="M -132 52 L 132 52 L 162 102 C 166 122 148 138 120 138 L -120 138 C -148 138 -166 122 -162 102 Z"/>
    <g stroke="#3d2a1f" stroke-width="1">
      <path fill="#6b4e3d" d="M -110 138 L -120 232 L -98 232 L -90 138 Z"/>
      <path fill="#6b4e3d" d="M -34 138 L -42 232 L -20 232 L -12 138 Z"/>
      <path fill="#6b4e3d" d="M 22 138 L 16 232 L 38 232 L 46 138 Z"/>
      <path fill="#6b4e3d" d="M 100 138 L 90 232 L 112 232 L 122 138 Z"/>
    </g>
  </g>
  <text x="320" y="500" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" fill="#c94a4a" opacity="0.85">مجعّد • قماش رقيق • مقاس غير متناسق</text>
  <!-- أغطيتنا (يمين) -->
  <rect x="620" y="60" width="520" height="480" rx="18" fill="#f3faf6" stroke="${brand.primary}" stroke-opacity="0.4" stroke-width="1.5"/>
  <text x="880" y="100" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="22" font-weight="700" fill="${brand.primary}">ميزون إلوريا ✓</text>
  <g transform="translate(880, 0) scale(0.65) translate(-880, 360)">
    ${chairGroup('#1B3A5C', { x: 880, y: 0, scale: 1 })}
  </g>
  <text x="880" y="500" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" fill="${brand.primary}" opacity="0.85">طرف مطاطي • مقاس مفصّل • قماش متين</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Happy customer (stylized portrait)                                  */
/* ------------------------------------------------------------------ */

function customerSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="عميلة راضية">
  ${defsCommon}
  <rect width="600" height="600" fill="url(#creamBg)"/>
  <circle cx="300" cy="300" r="240" fill="url(#goldShine)" opacity="0.15"/>
  <!-- وشاح / حجاب -->
  <path d="M 300 110 C 200 110 160 200 160 290 L 160 470 C 160 510 200 530 240 530 L 360 530 C 400 530 440 510 440 470 L 440 290 C 440 200 400 110 300 110 Z"
    fill="${brand.primary}" stroke="${brand.primaryDark}" stroke-width="1.5"/>
  <!-- وجه -->
  <ellipse cx="300" cy="290" rx="86" ry="100" fill="#f3d4b5"/>
  <!-- ابتسامة -->
  <path d="M 270 320 Q 300 340 330 320" fill="none" stroke="#8b5a3c" stroke-width="3" stroke-linecap="round"/>
  <!-- عيون -->
  <ellipse cx="270" cy="276" rx="6" ry="3" fill="${brand.primaryDark}"/>
  <ellipse cx="330" cy="276" rx="6" ry="3" fill="${brand.primaryDark}"/>
  <!-- خد -->
  <circle cx="244" cy="306" r="10" fill="#e8a987" opacity="0.6"/>
  <circle cx="356" cy="306" r="10" fill="#e8a987" opacity="0.6"/>
  <!-- نجوم تقييم -->
  <g transform="translate(300, 470)" fill="url(#goldShine)">
    ${[-60, -30, 0, 30, 60].map(x => `<polygon points="${x},-12 ${x + 4},-4 ${x + 12},-3 ${x + 6},3 ${x + 8},12 ${x},7 ${x - 8},12 ${x - 6},3 ${x - 12},-3 ${x - 4},-4"/>`).join('')}
  </g>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* COD delivery moment                                                  */
/* ------------------------------------------------------------------ */

function codSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="التوصيل والدفع عند الاستلام">
  ${defsCommon}
  <rect width="800" height="600" fill="url(#creamBg)"/>
  <!-- باب الدار -->
  <rect x="80" y="120" width="240" height="380" rx="6" fill="${brand.primary}" stroke="${brand.primaryDark}"/>
  <rect x="100" y="140" width="200" height="140" rx="4" fill="${brand.primaryDark}" opacity="0.6"/>
  <rect x="100" y="300" width="200" height="180" rx="4" fill="${brand.primaryDark}" opacity="0.45"/>
  <circle cx="290" cy="310" r="6" fill="url(#goldShine)"/>
  <!-- موصل -->
  <g transform="translate(520, 360)">
    <rect x="-60" y="-30" width="120" height="120" rx="60" fill="#3a86ff"/>
    <circle cx="0" cy="-50" r="40" fill="#f3d4b5"/>
    <rect x="-30" y="-90" width="60" height="36" rx="6" fill="#3a86ff"/>
    <text x="-26" y="-66" font-family="'Inter', sans-serif" font-size="12" fill="#fff" font-weight="700">📦</text>
  </g>
  <!-- صندوق ميزون إلوريا فاليد -->
  <g transform="translate(640, 360)">
    <rect x="-46" y="-40" width="92" height="80" rx="6" fill="url(#primaryDeep)" filter="url(#soft)"/>
    <rect x="-46" y="-40" width="92" height="20" fill="${brand.gold}"/>
    <text x="0" y="0" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
      font-size="10" letter-spacing="2" font-weight="700" fill="url(#goldShine)">ELORIA</text>
    <text x="0" y="22" text-anchor="middle" font-family="'Inter', sans-serif" font-size="9"
      fill="#fff" opacity="0.8">باك 6 — بيج</text>
  </g>
  <!-- علامات COD -->
  <g transform="translate(660, 130)">
    <rect x="-90" y="-30" width="180" height="60" rx="30" fill="${brand.primary}"/>
    <text x="0" y="6" text-anchor="middle" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="url(#goldShine)">💳 الدفع عند الاستلام</text>
  </g>
  <text x="400" y="560" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="20" font-weight="700" fill="${brand.primary}">توصيل لباب الدار — والدفع كيتم بعد ما تشوفي المنتج</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* All colors flatlay (mini chairs grid)                               */
/* ------------------------------------------------------------------ */

function allColorsSvg() {
  const colors = [
    ['#D4C5A9', 'بيج'], ['#8E8E8E', 'رمادي'], ['#6B4226', 'بني'],
    ['#2C2C2C', 'أسود'], ['#F5F5F0', 'أبيض'], ['#722F37', 'بوردو'],
    ['#1B3A5C', 'أزرق بحري'], ['#556B2F', 'زيتوني'], ['#FFFDD0', 'كريمي'],
  ];
  let cells = '';
  colors.forEach(([hex, name], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 130 + col * 220, y = 100 + row * 220;
    cells += `
    <g transform="translate(${x},${y})">
      <rect x="-90" y="-90" width="180" height="180" rx="14" fill="${brand.cream}" stroke="url(#goldShine)" stroke-width="1.2" filter="url(#softer)"/>
      <g transform="scale(0.32)">
        ${chairGroup(hex, { x: 0, y: 0, scale: 1 })}
      </g>
      <text y="76" text-anchor="middle" font-family="'Inter', sans-serif"
        font-size="13" font-weight="700" fill="${brand.primary}">${name}</text>
    </g>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 800" width="900" height="800" role="img" aria-label="مجموعة 9 ألوان">
  ${defsCommon}
  <rect width="900" height="800" fill="url(#creamBg)"/>
  <text x="450" y="56" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="700" fill="${brand.primary}">مجموعة 9 ألوان</text>
  ${cells}
  <text x="450" y="780" text-anchor="middle" font-family="'Inter', sans-serif"
    font-size="13" fill="${brand.primary}" opacity="0.7">اختاري اللي يناسب ديكورك</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Overhead viral chairs                                               */
/* ------------------------------------------------------------------ */

function overheadSvg() {
  const seats = [
    [200, 220, '#D4C5A9'], [400, 180, '#722F37'], [600, 220, '#1B3A5C'],
    [200, 420, '#2C2C2C'], [400, 360, '#F5F5F0'], [600, 420, '#556B2F'],
    [200, 560, '#6B4226'], [400, 540, '#FFFDD0'], [600, 560, '#8E8E8E'],
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 700" width="800" height="700" role="img" aria-label="لقطة علوية لكراسي بألوان مختلفة">
  ${defsCommon}
  <defs>
    <pattern id="zellige2" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="80" height="80" fill="#F5EFE0"/>
      <path d="M 0 40 L 40 0 L 80 40 L 40 80 Z" fill="${brand.cream}" stroke="${brand.gold}" stroke-width="0.6" stroke-opacity="0.5"/>
      <circle cx="40" cy="40" r="4" fill="${brand.gold}" opacity="0.25"/>
    </pattern>
  </defs>
  <rect width="800" height="700" fill="url(#zellige2)"/>
  <!-- طاولة وسط -->
  <ellipse cx="400" cy="370" rx="200" ry="110" fill="#5b3d2a" opacity="0.95"/>
  <ellipse cx="400" cy="370" rx="180" ry="98" fill="#7a5439"/>
  <circle cx="400" cy="350" r="40" fill="url(#goldShine)" stroke="${brand.primary}" stroke-width="1"/>
  <text x="400" y="358" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="14" letter-spacing="3" font-weight="700" fill="${brand.primary}">M</text>
  ${seats.map(([cx, cy, hex]) => `
    <g transform="translate(${cx}, ${cy})">
      <ellipse rx="62" ry="48" fill="${hex}" stroke="${brand.primary}" stroke-width="1.5" filter="url(#soft)"/>
      <ellipse rx="38" ry="28" fill="${brand.primary}" opacity="0.10"/>
      <ellipse rx="14" ry="9" cy="-10" fill="#fff" opacity="0.35"/>
    </g>`).join('')}
  <text x="400" y="680" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" fill="${brand.primary}" opacity="0.7">9 كراسي بألوان المجموعة</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Transformation grid                                                 */
/* ------------------------------------------------------------------ */

function transformationGridSvg() {
  // 4 خانات: لكل خانة كرسي قديم/جديد
  const cell = (x, y, oldCol, newCol) => `
    <g transform="translate(${x}, ${y})">
      <rect x="0" y="0" width="380" height="240" rx="14" fill="${brand.cream}" stroke="url(#goldShine)" stroke-width="1.2"/>
      <line x1="190" y1="20" x2="190" y2="220" stroke="${brand.gold}" stroke-opacity="0.5" stroke-dasharray="3 3"/>
      <text x="60" y="32" font-family="'Inter', sans-serif" font-size="11" letter-spacing="2" fill="#c94a4a" font-weight="700">قبل</text>
      <text x="320" y="32" font-family="'Inter', sans-serif" font-size="11" letter-spacing="2" fill="${brand.primary}" font-weight="700">بعد</text>
      <g transform="translate(95, 160) scale(0.45)">
        <path fill="${oldCol}" stroke="${brand.primary}" stroke-width="2"
          d="M -70 -60 C -70 -88 70 -92 70 -64 L 64 22 C 64 32 54 38 42 38 L -42 38 C -54 38 -64 32 -64 22 Z"/>
        <path fill="${oldCol}" stroke="${brand.primary}" stroke-width="2"
          d="M -70 30 L 70 30 L 86 56 C 88 68 78 76 62 76 L -62 76 C -78 76 -88 68 -86 56 Z"/>
      </g>
      <g transform="translate(285, 160) scale(0.45)">
        <path fill="${newCol}" stroke="${brand.primary}" stroke-width="2"
          d="M -70 -60 C -70 -88 70 -88 70 -60 L 64 22 C 64 32 54 38 42 38 L -42 38 C -54 38 -64 32 -64 22 Z"/>
        <path fill="${newCol}" stroke="${brand.primary}" stroke-width="2"
          d="M -70 30 L 70 30 L 86 56 C 88 68 78 76 62 76 L -62 76 C -78 76 -88 68 -86 56 Z"/>
      </g>
    </g>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 560" width="820" height="560" role="img" aria-label="تحوّلات حقيقية">
  ${defsCommon}
  <rect width="820" height="560" fill="url(#creamBg)"/>
  <text x="410" y="48" text-anchor="middle" font-family="'Playfair Display', Georgia, serif"
    font-size="24" font-weight="700" fill="${brand.primary}">تحوّلات حقيقية في صالونات مغربية</text>
  ${cell(20, 70, '#a89578', '#722F37')}
  ${cell(420, 70, '#a89578', '#1B3A5C')}
  ${cell(20, 320, '#a89578', '#D4C5A9')}
  ${cell(420, 320, '#a89578', '#556B2F')}
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

const products = [
  ['product-beige-main.svg', '#D4C5A9', 'بيج'],
  ['product-gris.svg', '#8E8E8E', 'رمادي'],
  ['product-marron.svg', '#6B4226', 'بني'],
  ['product-noir.svg', '#2C2C2C', 'أسود'],
  ['product-blanc.svg', '#F5F5F0', 'أبيض'],
  ['product-bordeaux.svg', '#722F37', 'بوردو'],
  ['product-bleu-marine.svg', '#1B3A5C', 'أزرق بحري'],
  ['product-olive.svg', '#556B2F', 'زيتوني'],
  ['product-creme.svg', '#FFFDD0', 'كريمي'],
];

async function main() {
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'hero-banner.svg'), heroSvg());
  await writeFile(join(outDir, 'moroccan-salon-real.svg'), salonSvg('#D4C5A9'));
  await writeFile(join(outDir, 'lifestyle-salon-beige.svg'), lifestyleSvg('#D4C5A9'));
  await writeFile(join(outDir, 'before-after-transformation.svg'), beforeAfterSvg());
  await writeFile(join(outDir, 'all-colors-flatlay.svg'), allColorsSvg());
  await writeFile(join(outDir, 'fabric-closeup.svg'), fabricSvg());
  await writeFile(join(outDir, 'packaging-unboxing.svg'), packagingSvg());
  await writeFile(join(outDir, 'easy-installation.svg'), installSvg());
  await writeFile(join(outDir, 'viral-overhead-chairs.svg'), overheadSvg());
  await writeFile(join(outDir, 'quality-comparison.svg'), compareSvg());
  await writeFile(join(outDir, 'happy-customer-moroccan.svg'), customerSvg());
  await writeFile(join(outDir, 'cod-delivery-moment.svg'), codSvg());
  await writeFile(join(outDir, 'transformation-grid.svg'), transformationGridSvg());
  for (const [file, hex, ar] of products) {
    await writeFile(join(outDir, file), productSvg(hex, ar));
  }
  console.log('✓ Wrote refreshed SVGs to', outDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
