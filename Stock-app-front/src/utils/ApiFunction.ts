// src/utils/ApiFunction.tsx
// Centralized API functions for Products, Restocks, and Sales

const BASE_URL = 'http://localhost:8080/api';

// Generic type for API response
type ApiResponse<T> = Promise<T>;

// Example types (customize as needed)
export interface Product {
  id?: number;
  name: string;
  designation: string;
  quantity: number;
  price: number;
  description: string;
  minQuantity?: number;
}

export interface RestockItem {
  id?: number;
  items: Array<{ productName: string; quantity: number }>;
  date?: string;
}

export interface SaleItem {
  id?: number;
  items: Array<{ productName: string; quantity: number }>;
  totalAmount?: number;
  timestamp?: string;
}

// Helper for fetch requests
async function request<T>(endpoint: string, method: string = 'GET', body: any = null): ApiResponse<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Product APIs
export const createProduct = (data: Product) => request<Product>('/product/create', 'POST', data);
export const updateProduct = (id: number, data: Product) => request<Product>(`/produit/update/${id}`, 'PUT', data);
export const deleteProduct = (id: number) => request<void>(`/produit/delete/${id}`, 'DELETE');
export const getProductById = (id: number) => request<Product>(`/produit/${id}`);
export const getAllProducts = () => request<Product[]>('/produit/getAllProd');
export const getProductByName = (name: string) => request<Product>(`/produit/getProdByNom/${name}`);

// Restock APIs
export const createRestock = (data: RestockItem) => request<RestockItem>('/new-achat', 'POST', data);
export const getAllRestocks = () => request<RestockItem[]>('/get-all-achat');

// Sale APIs
export const createSale = (data: SaleItem) => request<SaleItem>('/vente/newVente', 'POST', data);
export const getAllSales = () => request<SaleItem[]>('/vente/getAllVente');
export const getSaleById = (id: number) => request<SaleItem>(`/vente/by-id/${id}`);
export const getSalesByDate = (date: string) => request<SaleItem[]>(`/vente/by-date/${date}`);

// Add more functions as needed
