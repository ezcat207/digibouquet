export type FlowerId =
  | 'orchid'
  | 'tulip'
  | 'dahlia'
  | 'anemone'
  | 'carnation'
  | 'zinnia'
  | 'ranunculus'
  | 'sunflower'
  | 'lily'
  | 'daisy'
  | 'peony'
  | 'rose';

export type BouquetMode = 'color' | 'mono';

export interface FlowerSelection {
  id: FlowerId;
  count: number;
}

export interface Letter {
  dear: string;
  message: string;
  sincerely: string;
}

export interface Bouquet {
  short_id: string;
  mode: BouquetMode;
  flowers: FlowerSelection[];
  greenery: string;
  flowerOrder: number[];
  letter: Letter;
  timestamp: number;
}

export type BuilderStep = 'pick-flowers' | 'customize' | 'write-card' | 'support';
