import { ProductColor, Pack, Review, FAQItem } from './types';

export const SITE_NAME = 'Maison Eloria';
export const SITE_NAME_AR = 'ميزون إلوريا';
export const PRICE_PER_PIECE = 89;
export const CURRENCY = 'MAD';
export const CURRENCY_AR = 'درهم';

export const COLORS: ProductColor[] = [
  { id: 'beige', name: 'Beige', nameAr: 'بيج', hex: '#D4C5A9', image: '/images/product-beige-main.png' },
  { id: 'gris', name: 'Gris', nameAr: 'رمادي', hex: '#8E8E8E', image: '/images/product-gris.png' },
  { id: 'marron', name: 'Marron', nameAr: 'بني', hex: '#6B4226', image: '/images/product-marron.png' },
  { id: 'noir', name: 'Noir', nameAr: 'أسود', hex: '#2C2C2C', image: '/images/product-noir.png' },
  { id: 'blanc', name: 'Blanc', nameAr: 'أبيض', hex: '#F5F5F0', image: '/images/product-blanc.png' },
  { id: 'bordeaux', name: 'Bordeaux', nameAr: 'بوردو', hex: '#722F37', image: '/images/product-bordeaux.png' },
  { id: 'bleu-marine', name: 'Bleu Marine', nameAr: 'أزرق بحري', hex: '#1B3A5C', image: '/images/product-bleu-marine.png' },
  { id: 'olive', name: 'Olive', nameAr: 'زيتوني', hex: '#556B2F', image: '/images/product-olive.png' },
  { id: 'creme', name: 'Crème', nameAr: 'كريمي', hex: '#FFFDD0', image: '/images/product-creme.png' },
];

export const IMAGES = {
  logoMark: '/images/brand/logo-mark.svg',
  logoHorizontal: '/images/brand/logo-horizontal.svg',
  hero: '/images/photos/hero-moroccan-salon.png',
  lifestyle: '/images/lifestyle-salon-beige.png',
  beforeAfter: '/images/photos/before-after.png',
  allColors: '/images/all-colors-flatlay.png',
  fabricCloseup: '/images/fabric-closeup.png',
  packaging: '/images/packaging-unboxing.png',
  easyInstall: '/images/easy-installation.png',
  moroccanSalon: '/images/photos/hero-moroccan-salon.png',
  viralOverhead: '/images/viral-overhead-chairs.png',
  qualityComparison: '/images/quality-comparison.png',
  happyCustomer: '/images/happy-customer-moroccan.png',
  codDelivery: '/images/cod-delivery-moment.png',
  transformationGrid: '/images/transformation-grid.png',
};

export const PACKS: Pack[] = [
  {
    id: 'pack-4',
    quantity: 4,
    price: 250,
    originalPrice: 4 * PRICE_PER_PIECE,
    label: 'Pack 4',
    labelAr: 'باك 4 قطع',
  },
  {
    id: 'pack-6',
    quantity: 6,
    price: 330,
    originalPrice: 6 * PRICE_PER_PIECE,
    label: 'Pack 6',
    labelAr: 'باك 6 قطع',
    badge: 'Most Popular',
    badgeAr: '🔥 الأكثر طلباً',
  },
  {
    id: 'pack-8',
    quantity: 8,
    price: 380,
    originalPrice: 8 * PRICE_PER_PIECE,
    label: 'Pack 8',
    labelAr: 'باك 8 قطع',
    badge: 'Best Value',
    badgeAr: '💎 أفضل قيمة',
  },
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'فاطمة ب.',
    city: 'الدار البيضاء',
    rating: 5,
    text: 'واااو الجودة ممتازة! الكراسي ولاو بحال جداد. شكراً ميزون إلوريا 🙏',
    date: '2024-03-15',
  },
  {
    id: 2,
    name: 'أمينة ر.',
    city: 'الرباط',
    rating: 5,
    text: 'خديت باك 6 وكان عندي شك، ولكن القماش ممتاز والألوان زوينين بزاف 💚',
    date: '2024-03-10',
  },
  {
    id: 3,
    name: 'نورة م.',
    city: 'مراكش',
    rating: 5,
    text: 'التوصيل كان سريع والأغطية كيجيو مزيان على الكراسي. غادي نعاود نطلب للسالون ديال الضياف 😍',
    date: '2024-03-08',
  },
  {
    id: 4,
    name: 'سعاد ل.',
    city: 'فاس',
    rating: 4,
    text: 'منتج مزيان بزاف، من زمان وأنا كنقلب على شي حاجة بحال هاد الجودة. الثمن معقول والقماش متين.',
    date: '2024-03-05',
  },
  {
    id: 5,
    name: 'خديجة ع.',
    city: 'طنجة',
    rating: 5,
    text: 'طلبت لون بوردو وجاء رائع! الصالون ولّا أنيق بزاف. شكراً لكم ❤️',
    date: '2024-02-28',
  },
  {
    id: 6,
    name: 'مريم ت.',
    city: 'أكادير',
    rating: 5,
    text: 'أحسن استثمار درت فالدار! الأغطية كتحمي الكراسي وكتزيد فالأناقة. باك 8 كان أحسن اختيار 👌',
    date: '2024-02-25',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'واش الأغطية كتناسب جميع أنواع الكراسي؟',
    answer: 'نعم، أغطيتنا مصمّمة بقماش مطاطي عالي الجودة، وتناسب أغلب أنواع الكراسي القياسية. القماش يتمدّد ليتلاءم مع شكل الكرسي.',
  },
  {
    question: 'كيفاش نقدر نغسل الأغطية؟',
    answer: 'الأغطية كتتغسل بسهولة فالغسالة على 30°. ما كتحتاجش الكي، وكترجع لشكلها الأصلي بعد الغسيل.',
  },
  {
    question: 'شحال كياخد التوصيل؟',
    answer: 'التوصيل كياخد بين 24 و 72 ساعة حسب المدينة ديالك، وهو مجاني لجميع المدن المغربية.',
  },
  {
    question: 'واش نقدر نرجع المنتج إلا ما عجبنيش؟',
    answer: 'أكيد — عندك 7 أيام لإرجاع المنتج إذا ما عجبكش. تواصل معانا ونرتّبو ليك الإرجاع بكل سهولة.',
  },
  {
    question: 'واش الدفع عند الاستلام متاح؟',
    answer: 'نعم، الدفع عند الاستلام هو الطريقة الوحيدة والآمنة عندنا — ما كتخلص حتى توصلك السلعة وتشوفها.',
  },
  {
    question: 'شنو الفرق بين الباكات؟',
    answer: 'الفرق فعدد القطع والثمن: باك 4 بـ 250 درهم، باك 6 بـ 330 درهم (الأكثر طلباً)، وباك 8 بـ 380 درهم (أفضل قيمة). كل ما زاد العدد، كل ما زاد الربح!',
  },
];

export const MOROCCAN_CITIES = [
  'الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'أكادير',
  'مكناس', 'وجدة', 'القنيطرة', 'تطوان', 'سلا', 'الجديدة',
  'بني ملال', 'خريبكة', 'الناظور', 'سطات', 'آسفي', 'المحمدية',
];

export const TRUST_BADGES = [
  { icon: '🚚', title: 'توصيل مجاني', description: 'لجميع المدن المغربية' },
  { icon: '💳', title: 'الدفع عند الاستلام', description: 'ما تخلص حتى توصلك' },
  { icon: '🔄', title: 'إرجاع مجاني', description: '7 أيام للإرجاع' },
  { icon: '⭐', title: '+5000 زبون راضي', description: 'ثقة ورضا تام' },
];

export const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/collection', label: 'المجموعة' },
  { href: '/product', label: 'المنتج' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'اتصل بنا' },
];
