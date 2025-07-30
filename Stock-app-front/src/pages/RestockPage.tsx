import React, { useState, useMemo } from 'react';
import { useStock } from '../context/StockContext';
import { Plus, Search, Truck, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { RestockItem, Product } from '../utils/ApiFunction';

const RestockPage: React.FC = () => {
  const { products, restocks, addRestock, getLowStockProducts, fetchRestocks, fetchProducts } = useStock();
  const [isNewRestockModalOpen, setIsNewRestockModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRestocks = useMemo(() => {
    if (!searchTerm) return restocks;
    
    return restocks.filter(restock =>
      restock.items.some(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [restocks, searchTerm]);

  const lowStockProducts = getLowStockProducts();
  const totalRestockedItems = restocks.reduce((sum, restock) => 
    sum + (Array.isArray(restock.items) ? restock.items.reduce((itemSum, item) => itemSum + item.quantity, 0) : 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Inventory Restocking</h1>
              <p className="text-gray-400">
                Manage inventory replenishment • {restocks.length} restock operations
                {lowStockProducts.length > 0 && (
                  <span className="ml-2 text-red-400">
                    • {lowStockProducts.length} items need restocking
                  </span>
                )}
              </p>
            </div>
            <Button icon={Plus} onClick={() => setIsNewRestockModalOpen(true)}>
              New Restock
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Low Stock Items"
            value={lowStockProducts.length}
            subtitle="Items below minimum"
            color="red"
            alert={lowStockProducts.length > 0}
          />
          <StatCard
            title="Total Restocks"
            value={restocks.length}
            subtitle="All time operations"
            color="blue"
          />
          <StatCard
            title="Items Restocked"
            value={totalRestockedItems}
            subtitle="Total quantity added"
            color="green"
          />
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold mb-2">Low Stock Alert</h3>
                <p className="text-gray-300 mb-3">
                  {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} need immediate restocking:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {lowStockProducts.slice(0, 6).map(product => (
                    <div key={product.id} className="text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-red-400 ml-2">({product.quantity} left)</span>
                    </div>
                  ))}
                  {lowStockProducts.length > 6 && (
                    <div className="text-sm text-gray-400 px-3 py-2">
                      +{lowStockProducts.length - 6} more items
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search restock operations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Restocks Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Restock ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredRestocks.map((restock) => {
                  const totalQuantity = restock.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={restock.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-cyan-400">#{restock.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {restock.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-sm text-white">
                              {item.name} <span className="text-green-400">+{item.quantity}</span>
                            </div>
                          ))}
                          {restock.items.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{restock.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-green-400">+{totalQuantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">
                          {new Date(restock.date ?? '').toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(restock.date ?? '').toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredRestocks.length === 0 && (
            <div className="text-center py-12">
              <Truck className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No restock operations found</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Start restocking to see operations here'}
              </p>
            </div>
          )}
        </div>

        {/* New Restock Modal */}
        {isNewRestockModalOpen && (
          <NewRestockModal
            isOpen={isNewRestockModalOpen}
            onClose={() => setIsNewRestockModalOpen(false)}
            products={products}
            lowStockProducts={lowStockProducts}
            onSave={async (restockData) => {
              await addRestock(restockData);
              await fetchRestocks();
              await fetchProducts();
              setIsNewRestockModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  color: 'red' | 'blue' | 'green';
  alert?: boolean;
}> = ({ title, value, subtitle, color, alert }) => {
  const colorClasses = {
    red: 'from-red-500/20 to-red-600/20 text-red-400',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400',
  };

  return (
    <div className={`bg-gray-800 border rounded-xl p-6 ${
      alert ? 'border-red-500/30 bg-red-500/5' : 'border-gray-700'
    }`}>
      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
      <div className={`text-2xl font-bold mb-1 ${colorClasses[color].split(' ')[2]}`}>
        {value}
      </div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

export const NewRestockModal: React.FC<{ isOpen: boolean; onClose: () => void; products: Product[]; lowStockProducts: Product[]; onSave: (restock: RestockItem) => void; }> = ({ isOpen, onClose, products, lowStockProducts, onSave }) => {
  const [restockItems, setRestockItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const filteredProducts = (showLowStockOnly ? lowStockProducts : products).filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product: Product) => {
    const existingItem = restockItems.find(item => item.name === product.name);
    if (existingItem) {
      setRestockItems(prev =>
        prev.map(item =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setRestockItems(prev => [
        ...prev,
        {
          name: product.name,
          quantity: 1,
        },
      ]);
    }
  };

  const updateItemQuantity = (name: string, quantity: number) => {
    setRestockItems(prev =>
      prev.map(item =>
        item.name === name
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const removeItem = (name: string) => {
    setRestockItems(prev => prev.filter(item => item.name !== name));
  };

  const handleSave = () => {
    if (restockItems.length === 0) return;

    const items = restockItems.map(item => {
        const product = products.find(p => p.name === item.name);
        return {
          produit: {
            id: String(product?.id) ?? ' ',
            name: item.name,
          },
          quantite: item.quantity,
          prixVendu: item.soldPrice
        };
      });
    // Build RestockItem object
    onSave({
      items: items,
      date: new Date().toISOString(),
    });
    setRestockItems([]);
    setSearchTerm('');
    setShowLowStockOnly(false);
  };

  const handleClose = () => {
    setRestockItems([]);
    setSearchTerm('');
    setShowLowStockOnly(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Restock Operation" size="xl">
      <div className="space-y-6">
        {/* Quick Actions */}
        {lowStockProducts.length > 0 && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-400 font-medium">Quick Restock Low Stock Items</h3>
                <p className="text-gray-300 text-sm">{lowStockProducts.length} items need restocking</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  lowStockProducts.forEach(product => {
                    const suggestedQuantity = Math.max(10, product.minQuantity ? product.minQuantity * 2 : 10);
                    if (!restockItems.find(item => item.name === product.name)) {
                      setRestockItems(prev => [
                        ...prev,
                        {
                          name: product.name,
                          quantity: suggestedQuantity,
                        },
                      ]);
                    }
                  });
                }}
              >
                Add All Low Stock
              </Button>
            </div>
          </div>
        )}

        {/* Product Search */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Add Products to Restock</label>
          <div className="flex gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <Button
              variant={showLowStockOnly ? 'danger' : 'secondary'}
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            >
              {showLowStockOnly ? 'Show All' : 'Low Stock Only'}
            </Button>
          </div>
          {searchTerm && (
            <div className="mt-2 max-h-48 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg">
              {filteredProducts.slice(0, 5).map(product => {
                const isLowStock = lowStockProducts.some(p => p.name === product.name);
                return (
                  <button
                    key={product.name}
                    onClick={() => addItem(product)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{product.name}</span>
                          {isLowStock && <AlertTriangle className="w-4 h-4 text-red-400" />}
                        </div>
                        <div className="text-gray-400 text-sm">Current: {product.quantity} 2 Min: {product.minQuantity}</div>
                      </div>
                      <Plus className="w-4 h-4 text-cyan-400" />
                    </div>
                  </button>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="px-4 py-3 text-gray-400 text-center">No products found</div>
              )}
            </div>
          )}
        </div>

        {/* Restock Items */}
        {restockItems.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Items to Restock</label>
            <div className="space-y-2">
              {restockItems.map(item => {
                const product = products.find(p => p.name === item.name);
                const isLowStock = lowStockProducts.some(p => p.name === item.name);
                return (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{item.name}</span>
                        {isLowStock && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      </div>
                      <div className="text-gray-400 text-sm">Current: {product?.quantity} 2 Will be: {product ? product.quantity + item.quantity : item.quantity}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => updateItemQuantity(item.name, item.quantity - 1)} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white flex items-center justify-center">-</button>
                        <input type="number" value={item.quantity} onChange={(e) => updateItemQuantity(item.name, parseInt(e.target.value) || 1)} min={1} className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center text-white" />
                        <button onClick={() => updateItemQuantity(item.name, item.quantity + 1)} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white flex items-center justify-center">+</button>
                      </div>
                      <div className="text-green-400 font-medium w-16 text-right">+{item.quantity}</div>
                      <button onClick={() => removeItem(item.name)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={restockItems.length === 0}>Complete Restock</Button>
        </div>
      </div>
    </Modal>
  );
};

export default RestockPage;