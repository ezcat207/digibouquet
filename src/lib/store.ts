import type { Bouquet } from './types';

const store = new Map<string, Bouquet>();

export function saveBouquet(bouquet: Bouquet): void {
  store.set(bouquet.short_id, bouquet);
}

export function getBouquet(id: string): Bouquet | undefined {
  return store.get(id);
}
