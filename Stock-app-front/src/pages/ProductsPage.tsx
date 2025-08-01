import React, { useState, useMemo } from 'react';
import { useStock } from '../context/StockContext';
import { Plus, Search, AlertTriangle, Edit, Trash2, Package } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Product } from '../utils/ApiFunction';

const ProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, getLowStockProducts, fetchProducts } = useStock();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.designation === filterCategory);
    }
    if (showLowStock) {
      const lowStockIds = getLowStockProducts().map(p => p.id);
      filtered = filtered.filter(product => lowStockIds.includes(product.id));
    }
    return filtered;
  }, [products, searchTerm, filterCategory, showLowStock, getLowStockProducts]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.designation))];
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
                  placeholder="Search products..."
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
                <option value="all">All Categories</option>
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
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
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
                  const isLowStock = product.minQuantity !== undefined ? product.quantity <= product.minQuantity : false;
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
                            <div className="text-sm font-medium text-white">{product.name}</div>
                            <div className="text-sm text-gray-400 line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
                          {product.designation}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${isLowStock ? 'text-red-400' : 'text-white'}`}>
                            {product.quantity}
                          </span>
                          {isLowStock && <AlertTriangle className="w-4 h-4 text-red-400 ml-2" />}
                        </div>
                        <div className="text-xs text-gray-400">Min: {product.minQuantity}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-cyan-400">
                          {`FCFA ${(product.unitPrice ?? 0).toFixed(2)}`}
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
                          onClick={() => deleteProduct(product.id)}
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
          onSave={async (productDataOrList) => {
            if (editingProduct) {
              // Only allow single product update
              if (!Array.isArray(productDataOrList)) {
                await updateProduct(editingProduct.id, productDataOrList);
              }
            } else {
              // Multi-product creation
              await addProduct(productDataOrList);
            }
            await fetchProducts();
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
        />
      </div>
    </div>
  );
};

// Multi-product creation support
const ProductModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Product | Product[]) => void;
}> = ({ isOpen, onClose, product, onSave }) => {
  const [formList, setFormList] = useState<Product[]>([{
    id: 0,
    name: '',
    designation: '',
    quantity: 0,
    unitPrice: 0,
    description: '',
    minQuantity: 5,
  }]);

  React.useEffect(() => {
    if (product) {
      setFormList([{ ...product }]);
    } else {
      setFormList([{
        id: 0,
        name: '',
        designation: '',
        quantity: 0,
        unitPrice: 0,
        description: '',
        minQuantity: 5,
      }]);
    }
  }, [product]);

  const handleChange = (idx: number, field: keyof Product, value: any) => {
    setFormList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleAddRow = () => {
    setFormList(prev => [...prev, {
      id: 0,
      name: '',
      designation: '',
      quantity: 0,
      unitPrice: 0,
      description: '',
      minQuantity: 5,
    }]);
  };

  const handleRemoveRow = (idx: number) => {
    setFormList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formList.length === 1) {
      onSave(formList[0]);
    } else {
      onSave(formList);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product(s)'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {formList.map((formData, idx) => (
          <div key={idx} className="grid md:grid-cols-5 gap-4 items-end mb-2">
            <Input
              label="Product Name"
              value={formData.name}
              onChange={(e) => handleChange(idx, 'name', e.target.value)}
              placeholder="Enter product name"
              required
            />
            <Input
              label="Category"
              value={formData.designation}
              onChange={(e) => handleChange(idx, 'designation', e.target.value)}
              placeholder="e.g., Electronics, Clothing"
              required
            />
            <Input
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange(idx, 'quantity', parseInt(e.target.value) || 0)}
              min={0}
              required
            />
            <Input
              label="Unit Price (FCFA)"
              type="number"
              value={formData.unitPrice}
              onChange={(e) => handleChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
              min={0}
              step={0.01}
              required
            />
            <Input
              label="Min Quantity"
              type="number"
              value={formData.minQuantity ?? 0}
              onChange={(e) => handleChange(idx, 'minQuantity', parseInt(e.target.value) || 0)}
              min={0}
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange(idx, 'description', e.target.value)}
              placeholder="Enter product description"
              multiline
              rows={2}
            />
            {formList.length > 1 && (
              <Button variant="danger" onClick={() => handleRemoveRow(idx)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={handleAddRow}>
            Add Another Product
          </Button>
          <div className="flex space-x-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update Product' : 'Add Product(s)'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProductsPage;