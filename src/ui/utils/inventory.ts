import { Car } from '../interfaces/car';
import { UsedCarPart } from '../interfaces/used-car-part';

export type InventoryItem = Car | UsedCarPart;

export const getInventoryType = (
  item: InventoryItem
): 'car' | 'used-car-part' => ('year' in item ? 'car' : 'used-car-part');
