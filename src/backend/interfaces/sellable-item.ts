export interface SellableItem {
  id: string;
  name: string;
  stock: string;
  price: number;
  salePrice?: number;
  discount?: number;
  imageGallery: string[];
}
