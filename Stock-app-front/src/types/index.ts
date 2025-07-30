export interface Product {
  id: number;
  name: string;
  designation: string;
  quantity: number;
  price: number;
  description: string;
  minQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  productId: number;
  soldPrice: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: number;
  items: SaleItem[];
  totalAmount: number;
  timestamp: Date;
}

export interface RestockItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Restock {
  id: number;
  items: RestockItem[];
  timestamp: Date;
}