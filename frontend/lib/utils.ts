import { clsx, type ClassValue } from 'clsx';

import type { OrderData } from './types';

/** Sum of line totals in MAD (2 decimals) — must match backend validation. */
export function computeOrderTotalMAD(items: OrderData['items']): number {
  const n = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round(n * 100) / 100;
}

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return `${price} درهم`;
}

export function formatUnitPrice(total: number, quantity: number): string {
  const unitPrice = total / quantity;
  if (quantity === 8 && !Number.isInteger(unitPrice)) return unitPrice.toFixed(1);
  return String(Math.round(unitPrice));
}

export function calculateDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

export function validateMoroccanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return /^0[67]\d{8}$/.test(cleaned);
}

export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function generateOrderNumber(): string {
  const prefix = 'ME';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid', 'sclid'];
  const result: Record<string, string> = {};
  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value) result[key] = value;
  });
  return result;
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomCity(cities: string[]): string {
  return cities[Math.floor(Math.random() * cities.length)];
}
