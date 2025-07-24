export interface Product {
  qte: number;
  nom: any;
  code(code: any): unknown;
  uprix: ReactNode;
  id: string;
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
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  timestamp: Date;
}

export interface RestockItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Restock {
  id: string;
  items: RestockItem[];
  timestamp: Date;
}