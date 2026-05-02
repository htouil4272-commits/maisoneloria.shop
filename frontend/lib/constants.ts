import { ProductColor, Pack, Review, FAQItem } from './types';

export const SITE_NAME = 'Maison Eloria';
export const SITE_NAME_AR = 'ميزون إلوريا';
export const PRICE_PER_PIECE = 89;
export const CURRENCY = 'MAD';
export const CURRENCY_AR = 'درهم';

export const COLORS: ProductColor[] = [
  { id: 'beige', name: 'Beige', nameAr: 'بيج', hex: '#D4C5A9' },
  { id: 'gris', name: 'Gris', nameAr: 'رمادي', hex: '#8E8E8E' },
  { id: 'marron', name: 'Marron', nameAr: 'بني', hex: '#6B4226' },
  { id: 'noir', name: 'Noir', nameAr: 'أسود', hex: '#2C2C2C' },
  { id: 'blanc', name: 'Blanc', nameAr: 'أبيض', hex: '#F5F5F0' },
  { id: 'bordeaux', name: 'Bordeaux', nameAr: 'بوردو', hex: '#722F37' },
  { id: 'bleu-marine', name: 'Bleu Marine', nameAr: 'أزرق بحري', hex: '#1B3A5C' },
  { id: 'olive', name: 'Olive', nameAr: 'زيتوني', hex: '#556B2F' },
  { id: 'creme', name: 'Crème', nameAr: 'كريمي', hex: '#FFFDD0' },
];

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
    badgeAr: 'الأكثر طلباً',
  },
  {
    id: 'pack-9',
    quantity: 9,
    price: 380,
    originalPrice: 9 * PRICE_PER_PIECE,
    label: 'Pack 9',
    labelAr: 'باك 9 قطع',
    badge: 'Best Value',
    badgeAr: 'أفضل قيمة',
  },
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'فاطمة ب.',
    city: 'الدار البيضاء',
    rating: 5,
    text: 'واااو الجودة خطيرة! الكراسي ديالي ولاو كأنهم جداد. شكراً ميزون إلوريا 🙏',
    date: '2024-03-15',
  },
  {
    id: 2,
    name: 'أمينة ر.',
    city: 'الرباط',
    rating: 5,
    text: 'خذيت باك 6 وكان عندي شك، ولكن فالحقيقة القماش ممتاز والألوان زوينين بزاف 💚',
    date: '2024-03-10',
  },
  {
    id: 3,
    name: 'نورة م.',
    city: 'مراكش',
    rating: 5,
    text: 'التوصيل كان سريع والأغطية كيجيو مزيان على الكراسي. غادي نعاود نطلب للصالون 😍',
    date: '2024-03-08',
  },
  {
    id: 4,
    name: 'سعاد ل.',
    city: 'فاس',
    rating: 4,
    text: 'منتوج مزيان بزاف، كنت كنقلب على شي حاجة بحال هكا من زمان. الثمن معقول والجودة عالية.',
    date: '2024-03-05',
  },
  {
    id: 5,
    name: 'خديجة ع.',
    city: 'طنجة',
    rating: 5,
    text: 'طلبت اللون البوردو وجا رائع! الكراسي ديالي ولاو أنيقين بزاف. شكراً ليكم ❤️',
    date: '2024-02-28',
  },
  {
    id: 6,
    name: 'مريم ت.',
    city: 'أكادير',
    rating: 5,
    text: 'أحسن استثمار دارت فالدار! الأغطية كيحميو الكراسي وكيزيدوهم جمال. باك 9 كان أفضل اختيار 👌',
    date: '2024-02-25',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'واش الأغطية كتناسب جميع أنواع الكراسي؟',
    answer: 'نعم، الأغطية ديالنا مصممين بقماش مطاطي عالي الجودة كيتناسب مع أغلب أنواع الكراسي القياسية. القماش كيتمدد ليتناسب مع الشكل ديال الكرسي ديالك.',
  },
  {
    question: 'كيفاش نقدر نغسل الأغطية؟',
    answer: 'الأغطية كتتغسل بسهولة فالماكينة على درجة حرارة 30°. ما كيحتاجوش كوي وكيرجعو كما كانو بعد الغسيل.',
  },
  {
    question: 'شحال كيوصل التوصيل؟',
    answer: 'التوصيل كيوصل بين 24 و 72 ساعة حسب المدينة ديالك. التوصيل مجاني لجميع المدن المغربية.',
  },
  {
    question: 'واش نقدر نرجع المنتوج إلا ما عجبنيش؟',
    answer: 'طبعاً! عندك 7 أيام باش ترجع المنتوج إلا ما عجبكش. غير تواصل معانا وغادي نديرو ليك الإرجاع بلا مشاكل.',
  },
  {
    question: 'واش الدفع عند الاستلام متاح؟',
    answer: 'نعم، الدفع عند الاستلام (COD) هو الطريقة الوحيدة للدفع. ما كتخلص حتى توصلك السلعة وتشوفها.',
  },
  {
    question: 'شنو الفرق بين الباكات؟',
    answer: 'الفرق هو فعدد القطع والثمن. باك 4 ب 250 درهم، باك 6 ب 330 درهم (الأكثر طلباً)، وباك 9 ب 380 درهم (أفضل قيمة). كلما زدتي فالعدد، كلما ربحتي أكثر!',
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
  { icon: '⭐', title: '+5000 عميلة راضية', description: 'ثقة ورضا تام' },
];

export const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/collection', label: 'المجموعة' },
  { href: '/product', label: 'المنتوج' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'اتصل بنا' },
];
