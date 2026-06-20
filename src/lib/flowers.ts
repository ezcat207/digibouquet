import type { FlowerId } from './types';

export interface FlowerMeta {
  id: FlowerId;
  description: string;
  birthMonth: string;
}

export const FLOWERS: FlowerMeta[] = [
  { id: 'orchid', description: 'Exotic Beauty', birthMonth: 'January' },
  { id: 'tulip', description: 'Perfect Love', birthMonth: 'April' },
  { id: 'dahlia', description: 'Elegance & Dignity', birthMonth: 'August' },
  { id: 'anemone', description: 'Anticipation', birthMonth: 'March' },
  { id: 'carnation', description: 'Fascination', birthMonth: 'January' },
  { id: 'zinnia', description: 'Enduring Friendship', birthMonth: 'April' },
  { id: 'ranunculus', description: 'Radiant Charm', birthMonth: 'March' },
  { id: 'sunflower', description: 'Adoration', birthMonth: 'August' },
  { id: 'lily', description: 'Purity & Grace', birthMonth: 'May' },
  { id: 'daisy', description: 'Innocence', birthMonth: 'May' },
  { id: 'peony', description: 'Prosperity', birthMonth: 'June' },
  { id: 'rose', description: 'Love & Passion', birthMonth: 'June' },
];

export const CDN_BASE = 'https://assets.pauwee.com';

export function flowerImageUrl(id: FlowerId, mode: 'color' | 'mono' = 'color'): string {
  return `${CDN_BASE}/${mode}/flowers/${id}.webp`;
}

export function bushImageUrl(name: string, mode: 'color' | 'mono' = 'color'): string {
  return `${CDN_BASE}/${mode}/bush/${name}.png`;
}

export function logoUrl(): string {
  return `${CDN_BASE}/other/digibouquet.png`;
}
