import { SellableItem } from './sellable-item';

export interface Car extends SellableItem {
  id: string;
  year: number;
  engine: string;
  gearType: string;
  gasType: string;
}
