import React, { useState, useMemo } from 'react';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
} from '../utils/ApiFunction';
import { Plus, Search, Filter, AlertTriangle, Edit, Trash2, Package } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
  React.useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then((data) => setProducts(data as Product[]))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Add product
  const handleAddProduct = async (data: any) => {
    setLoading(true);
    try {
      // Only send the required fields
      await createProduct({
        nom: data.nom,
        code: data.code,
        uprix: data.uprix,
        qte: data.qte
      });
      const updated = await getAllProducts();
      setProducts(updated);
      setIsAddModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEditProduct = async (id: number, data: any) => {
    setLoading(true);
    try {
      await updateProduct(id, {
        nom: data.nom,
        code: data.code,
        uprix: data.uprix,
        qte: data.qte
      });
      const updated = await getAllProducts();
      setProducts(updated);
      setEditingProduct(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get low stock products (example: qte < 10)
  const getLowStockProducts = () => products.filter(p => p.qte <= 10);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => String(product.code) === filterCategory);
    }

    if (showLowStock) {
      const lowStockIds = getLowStockProducts().map(p => p.id);
      filtered = filtered.filter(product => lowStockIds.includes(product.id));
    }

    return filtered;
  }, [products, searchTerm, filterCategory, showLowStock, getLowStockProducts]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => String(p.code)))];
    return cats.sort();
  }, [products]);

  const lowStockProducts = getLowStockProducts();

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Product Management</h1>
              <p className="text-gray-400">
                Manage your inventory with {products.length} products
                {lowStockProducts.length > 0 && (
                  <span className="ml-2 text-red-400">
                    • {lowStockProducts.length} low stock alerts
                  </span>
                )}
              </p>
            </div>
            <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Codes</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Button
                variant={showLowStock ? 'danger' : 'secondary'}
                icon={AlertTriangle}
                onClick={() => setShowLowStock(!showLowStock)}
                className="flex-shrink-0"
              >
                {showLowStock ? 'Show All' : 'Low Stock'}
              </Button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProducts.map((product) => {
                  const isLowStock = product.qte <= 10;
                  return (
                    <tr key={product.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                              <Package className="w-6 h-6 text-cyan-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{product.nom}</div>
                            <div className="text-sm text-gray-400 line-clamp-1">Code: {product.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
                          {product.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${isLowStock ? 'text-red-400' : 'text-white'}`}>
                            {product.qte}
                          </span>
                          {isLowStock && <AlertTriangle className="w-4 h-4 text-red-400 ml-2" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-cyan-400">
                          ${product.uprix}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isLowStock 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {isLowStock ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                          onClick={() => setEditingProduct(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No products found</h3>
              <p className="text-gray-500">
                {searchTerm || filterCategory !== 'all' || showLowStock
                  ? 'Try adjusting your search or filters'
                  : 'Add your first product to get started'}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        <ProductModal
          isOpen={isAddModalOpen || editingProduct !== null}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onSave={(productData) => {
            if (editingProduct) {
              handleEditProduct(editingProduct.id, productData);
            } else {
              handleAddProduct(productData);
            }
          }}
        />
      </div>
    </div>
  );
};

const ProductModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Omit<Product, 'id' | 'message' | 'venteId'>) => void;
}> = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    nom: '',
    code: 0,
    uprix: 0,
    qte: 0
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        nom: product.nom,
        code: product.code,
        uprix: product.uprix,
        qte: product.qte
      });
    } else {
      setFormData({
        nom: '',
        code: 0,
        uprix: 0,
        qte: 0
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Product Name"
            value={formData.nom}
            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
            placeholder="Enter product name"
            required
          />
          <Input
            label="Code"
            type="number"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: parseInt(e.target.value) || 0 }))}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Unit Price"
            type="number"
            value={formData.uprix}
            onChange={(e) => setFormData(prev => ({ ...prev, uprix: parseFloat(e.target.value) || 0 }))}
            min={0}
            step={0.01}
            required
          />
          <Input
            label="Quantity"
            type="number"
            value={formData.qte}
            onChange={(e) => setFormData(prev => ({ ...prev, qte: parseInt(e.target.value) || 0 }))}
            min={0}
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductsPage;