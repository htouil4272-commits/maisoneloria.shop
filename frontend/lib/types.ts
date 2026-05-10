export interface ProductColor {
  id: string;
  name: string;
  nameAr: string;
  hex: string;
  image?: string;
  /** CSS object-position لعرض المكان الصحيح من الصورة (مثلاً عند استخدام لقطة عريضة) */
  imagePosition?: string;
}

export interface Pack {
  id: string;
  quantity: number;
  price: number;
  originalPrice: number;
  label: string;
  labelAr: string;
  badge?: string;
  badgeAr?: string;
}

export interface CartItem {
  id: string;
  colorId: string;
  colorName: string;
  colorNameAr: string;
  colorHex: string;
  packId: string;
  packQuantity: number;
  price: number;
  quantity: number;
}

export interface OrderData {
  name: string;
  phone: string;
  city: string;
  items: CartItem[];
  total: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  ttclid?: string;
  sclid?: string;
  event_id: string;
  landing_page?: string;
  referrer?: string;
}

export interface Review {
  id: number;
  name: string;
  city: string;
  rating: number;
  text: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
