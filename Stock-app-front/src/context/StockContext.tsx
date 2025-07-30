import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, SaleItem, RestockItem } from '../utils/ApiFunction';
import * as api from '../utils/ApiFunction';

interface StockContextType {
  products: Product[];
  sales: SaleItem[];
  restocks: RestockItem[];
  fetchProducts: () => Promise<void>;
  fetchSales: () => Promise<void>;
  fetchRestocks: () => Promise<void>;
  addProduct: (product: Product | Product[]) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addSale: (items: SaleItem) => Promise<SaleItem>;
  addRestock: (items: RestockItem) => Promise<void>;
  getLowStockProducts: () => Product[];
  getProductById: (id: number) => Product | undefined;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

// No local mock data


export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [restocks, setRestocks] = useState<RestockItem[]>([]);

  // Fetch all products
  const fetchProducts = async () => {
    const data = await api.getAllProducts();
    setProducts(data);
  };

  // Fetch all sales
  const fetchSales = async () => {
    const rawData = await api.getAllSales();

    const transformedSales = rawData.map((sale: any) => {
      return {
        id: String(sale.id),
        timestamp: new Date(sale.date).toISOString(),
        totalAmount: sale.prixVendu,
        items: sale.nomProdEtPrixT.map((line: string) => {
          const regex = /CodeProduit:\s*(\d+),\s*Nom produit:\s*([^,]+),\s*Qte produit:\s*(\d+),\s*Prix unitaire:\s*([\d.]+),\s*Prix vendu:\s*([\d.]+),\s*Total:\s*([\d.]+)/;
          const match = line.match(regex);
          return {
            id: match?.[1] || '',
            name: match?.[2] || '',
            quantity: Number(match?.[3]) || 0,
            unitPrice: Number(match?.[4]) || 0,
            soldPrice: Number(match?.[5]) || 0
          };
        })
      };
    });

    setSales(transformedSales);
  };


  


  // Fetch all restocks
  const fetchRestocks = async () => {
    const rawData = await api.getAllRestocks();

    const transformedRestocks = rawData.map((restock: any) => {
      return {
        id: restock.id,
        date: new Date(restock.date).toISOString(),
        items: restock.nomProdEtPrixT.map((line: string) => {
          const regex = /CodeProduit:\s*(\d+),\s*Nom produit:\s*([^,]+),\s*Qte produit:\s*(\d+),\s*Prix unitaire:\s*([\d.]+),\s*Total:\s*([\d.]+)/;
          const match = line.match(regex);
          return {
            id: match?.[1] || '',
            name: match?.[2] || '',
            quantity: Number(match?.[3]) || 0,
            unitPrice: Number(match?.[4]) || 0
          };
        }),
        produit: restock.nomProdEtPrixT.map((line: string) => {
          const regex = /CodeProduit:\s*(\d+),\s*Nom produit:\s*([^,]+),\s*Qte produit:\s*(\d+),\s*Prix unitaire:\s*([\d.]+),\s*Total:\s*([\d.]+)/;
          const match = line.match(regex);
          return {
            id: Number(match?.[1]) || 0,
            name: match?.[2] || '',
            quantity: Number(match?.[3]) || 0,
          };
        })
      };
    });

    setRestocks(transformedRestocks);
  };


  // Add product(s)
  const addProduct = async (product: Product | Product[]) => {
    await api.createProduct(product);
    await fetchProducts();
  };

  // Update product
  const updateProduct = async (id: number, updates: Partial<Product>) => {
    await api.updateProduct(id, updates as Product);
    await fetchProducts();
  };

  // Delete product
  const deleteProduct = async (id: number) => {
    await api.deleteProduct(id);
    await fetchProducts();
  };

  // Add sale
  const addSale = async (sale: SaleItem) => {
    const result = await api.createSale(sale);
    await fetchSales();
    await fetchProducts();
    return result;
  };

  // Add restock
  const addRestock = async (restock: RestockItem) => {
    await api.createRestock(restock);
    await fetchRestocks();
    await fetchProducts();
  };

  // Get low stock products
  const getLowStockProducts = () => {
    return products.filter(product => product.minQuantity !== undefined && product.quantity <= product.minQuantity);
  };

  // Get product by id
  const getProductById = (id: number) => {
    return products.find(product => product.id === id);
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
    fetchSales();
    fetchRestocks();
  }, []);

  return (
    <StockContext.Provider
      value={{
        products,
        sales,
        restocks,
        fetchProducts,
        fetchSales,
        fetchRestocks,
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