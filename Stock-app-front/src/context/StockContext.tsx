import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Sale, Restock, SaleItem, RestockItem } from '../types';

interface StockContextType {
  products: Product[];
  sales: Sale[];
  restocks: Restock[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (items: SaleItem[]) => Sale;
  addRestock: (items: RestockItem[]) => void;
  getLowStockProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Gaming Laptop',
    designation: 'Electronics',
    quantity: 15,
    price: 1299.99,
    description: 'High-performance gaming laptop with RTX graphics',
    minQuantity: 5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    designation: 'Audio',
    quantity: 3,
    price: 199.99,
    description: 'Premium noise-canceling wireless headphones',
    minQuantity: 10,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    name: 'Smart Watch',
    designation: 'Wearables',
    quantity: 25,
    price: 299.99,
    description: 'Advanced fitness tracking smartwatch',
    minQuantity: 8,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    designation: 'Peripherals',
    quantity: 2,
    price: 149.99,
    description: 'RGB mechanical keyboard with custom switches',
    minQuantity: 6,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
];

export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sales, setSales] = useState<Sale[]>([]);
  const [restocks, setRestocks] = useState<Restock[]>([]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addSale = (items: SaleItem[]): Sale => {
    const newSale: Sale = {
      id: generateId(),
      items,
      totalAmount: items.reduce((sum, item) => sum + item.totalPrice, 0),
      timestamp: new Date(),
    };

    // Update product quantities
    items.forEach(item => {
      setProducts(prev =>
        prev.map(product =>
          product.id === item.productId
            ? { 
                ...product, 
                quantity: Math.max(0, product.quantity - item.quantity),
                updatedAt: new Date()
              }
            : product
        )
      );
    });

    setSales(prev => [newSale, ...prev]);
    return newSale;
  };

  const addRestock = (items: RestockItem[]) => {
    const newRestock: Restock = {
      id: generateId(),
      items,
      timestamp: new Date(),
    };

    // Update product quantities
    items.forEach(item => {
      setProducts(prev =>
        prev.map(product =>
          product.id === item.productId
            ? { 
                ...product, 
                quantity: product.quantity + item.quantity,
                updatedAt: new Date()
              }
            : product
        )
      );
    });

    setRestocks(prev => [newRestock, ...prev]);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.quantity <= product.minQuantity);
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  return (
    <StockContext.Provider
      value={{
        products,
        sales,
        restocks,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        addRestock,
        getLowStockProducts,
        getProductById,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};