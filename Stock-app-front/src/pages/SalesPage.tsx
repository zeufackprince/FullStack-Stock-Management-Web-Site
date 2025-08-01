import React, { useState, useMemo } from 'react';
import { useStock } from '../context/StockContext';
import { Plus, Search, Download, Calendar, ShoppingCart, Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { SaleItem, Product } from '../utils/ApiFunction';
import { generatePDF } from '../utils/pdfGenerator';

const SalesPage: React.FC = () => {
  const { products, sales, addSale, fetchSales, fetchProducts } = useStock();
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredSales = useMemo(() => {
    let filtered = sales;
    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.items && sale.items.some(item =>
          item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(sale => {
        if (!sale.timestamp) return false;
        const saleDate = new Date(sale.timestamp);
        return saleDate.toDateString() === filterDate.toDateString();
      });
    }
    return filtered;
  }, [sales, searchTerm, dateFilter]);

  // Track expanded rows for sales table
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({}); 

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount ?? 0), 0);
  const todaySales = sales.filter(sale => {
    if (!sale.timestamp) return false;
    const today = new Date();
    const saleDate = new Date(sale.timestamp);
    return saleDate.toDateString() === today.toDateString();
  });
  const todayGain = todaySales.reduce((sum, sale) => sum + (sale.totalAmount ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Sales Management</h1>
              <p className="text-gray-400">
                Track your sales and revenue • {sales.length} total sales • {totalRevenue.toFixed(2)} FCFA revenue
              </p>
            </div>
            <Button icon={Plus} onClick={() => setIsNewSaleModalOpen(true)}>
              New Sale
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Today's Sales"
            value={todaySales.length}
            subtitle={`FCFA ${todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0).toFixed(2)} revenue`}
            color="cyan"
          />
          <StatCard
            title="Total Sales"
            value={sales.length}
            subtitle="All time transactions"
            color="blue"
          />
          <StatCard
            title="Total Revenue"
            value={`FCFA ${totalRevenue.toFixed(2)}`}
            subtitle="All time earnings"
            color="green"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <Button variant="secondary" icon={Download}>
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Today's Gain Grid */}
        <div className="bg-gray-900 rounded-xl border border-cyan-500/30 p-6 mb-8">
          <h2 className="text-xl font-bold text-cyan-400 mb-2">Today's Gain</h2>
          <div className="text-3xl font-bold text-white">FCFA {todayGain.toFixed(2)}</div>
        </div>

        {/* Sales Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sale ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      No available sales yet or network error.
                    </td>
                  </tr>
                ) : (
                  filteredSales.filter(sale => typeof sale.id === 'string' && sale.id !== '').map((sale) => {
                    const totalQuantity = sale.items ? sale.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
                    return (
                      <React.Fragment key={sale.id}>
                        <tr className="hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-cyan-400">#{sale.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {sale.items && sale.items.slice(0, 2).map((item, index) => (
                                <div key={index} className="text-sm text-white">
                                  {item.name} x{item.quantity}
                                </div>
                              ))}
                              {sale.items && sale.items.length > 2 && (
                                <button className="text-xs text-cyan-400 flex items-center gap-1" onClick={() => toggleRow(String(sale.id))}>
                                  {expandedRows[String(sale.id)] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />} Show all
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-white">{totalQuantity}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-green-400">{`FCFA ${(sale.totalAmount ?? 0).toFixed(2)}`}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-white">{sale.timestamp ? new Date(sale.timestamp).toLocaleDateString() : ''}</div>
                            <div className="text-xs text-gray-400">{sale.timestamp ? new Date(sale.timestamp).toLocaleTimeString() : ''}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" icon={FileText} onClick={() => generatePDF(sale)}>
                              Receipt
                            </Button>
                          </td>
                        </tr>
                        {expandedRows[sale.id!] && sale.items && (
                          <tr className="bg-gray-900">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left text-gray-300">
                                  <thead className="bg-gray-800 text-cyan-400">
                                    <tr>
                                      <th className="px-4 py-2">Code</th>
                                      <th className="px-4 py-2">Name</th>
                                      <th className="px-4 py-2">Qty</th>
                                      <th className="px-4 py-2">Unit Price</th>
                                      <th className="px-4 py-2">Sold Price</th>
                                      <th className="px-4 py-2">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sale.items.map((item, idx) => {
                                      const total = (item.quantity * (item.soldPrice ?? 0)).toFixed(2);
                                      return (
                                        <tr key={idx} className="border-t border-gray-700">
                                          <td className="px-4 py-2">{item.id ?? '-'}</td>
                                          <td className="px-4 py-2">{item.name ?? '-'}</td>
                                          <td className="px-4 py-2">{item.quantity ?? '-'}</td>
                                          <td className="px-4 py-2">{item.unitPrice?.toFixed(2) ?? '-'} FCFA</td>
                                          <td className="px-4 py-2">{item.soldPrice?.toFixed(2) ?? '-'} FCFA</td>
                                          <td className="px-4 py-2">{total} FCFA</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}

                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No sales found</h3>
              <p className="text-gray-500">
                {searchTerm || dateFilter
                  ? 'Try adjusting your search or filters'
                  : 'Make your first sale to get started'}
              </p>
            </div>
          )}
        </div>

        {/* New Sale Modal */}
        {/* New Sale Modal */}
        {isNewSaleModalOpen && (
          <NewSaleModal
            isOpen={isNewSaleModalOpen}
            onClose={() => setIsNewSaleModalOpen(false)}
            products={products}
            onSave={async (saleData) => {
              const sale = await addSale(saleData);
              await fetchSales();
              await fetchProducts();
              generatePDF(sale);
              setIsNewSaleModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; subtitle: string; color: 'cyan' | 'blue' | 'green' }> = ({ title, value, subtitle, color }) => {
  const colorClasses = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
  };
  return (
    <div className={`bg-gray-800 border rounded-xl p-6 border-gray-700`}>
      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
      <div className={`text-2xl font-bold mb-1 ${colorClasses[color]}`}>{value}</div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

// Sale modal with soldPrice field
export const NewSaleModal: React.FC<{ isOpen: boolean; onClose: () => void; products: Product[]; onSave: (sale: SaleItem) => void; }> = ({ isOpen, onClose, products, onSave }) => {
  const [saleItems, setSaleItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const availableProducts = products.filter(p => p.quantity > 0);
  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product: Product) => {
    const existingItem = saleItems.find(item => item.name === product.name);
    if (existingItem) {
      setSaleItems(prev =>
        prev.map(item =>
          item.name === product.name
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.quantity),
                totalPrice: (Math.min(item.quantity + 1, product.quantity)) * (item.soldPrice ?? product.unitPrice)
              }
            : item
        )
      );
    } else {
      setSaleItems(prev => [
        ...prev,
        {
          name: product.name,
          quantity: 1,
          unitPrice: product.unitPrice,
          soldPrice: product.unitPrice,
          totalPrice: product.unitPrice,
        },
      ]);
    }
  };

  const updateItemQuantity = (name: string, quantity: number) => {
    const product = products.find(p => p.name === name);
    if (!product) return;
    setSaleItems(prev =>
      prev.map(item =>
        item.name === name
          ? {
              ...item,
              quantity: Math.min(Math.max(1, quantity), product.quantity),
              totalPrice: Math.min(Math.max(1, quantity), product.quantity) * (item.soldPrice ?? item.unitPrice)
            }
          : item
      )
    );
  };

  const updateSoldPrice = (name: string, soldPrice: number) => {
    setSaleItems(prev =>
      prev.map(item =>
        item.name === name
          ? {
              ...item,
              soldPrice,
              totalPrice: item.quantity * soldPrice
            }
          : item
      )
    );
  };

  const removeItem = (name: string) => {
    setSaleItems(prev => prev.filter(item => item.name !== name));
  };

  const totalAmount = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSave = () => {
    if (saleItems.length === 0) return;

    // Build items array as expected by VenteItem interface
    const items = saleItems.map(item => {
      const product = products.find(p => p.name === item.name);
      return {
        produit: {            
          id: product?.id ?? 0,
          name: item.name,
        },
        quantite: item.quantity,
        prixVendu: item.soldPrice
      };
    });

    // Build Vente object
    const vente = {
      items,
      coutTotal: totalAmount,
      date: new Date().toISOString(),
    };

    onSave(vente);   // Call API with the corrected structure

    setSaleItems([]);
    setSearchTerm('');
  };


  const handleClose = () => {
    setSaleItems([]);
    setSearchTerm('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Sale" size="xl">
      <div className="space-y-6">
        {/* Product Search */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Add Products</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products to add..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          {searchTerm && (
            <div className="mt-2 max-h-48 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg">
              {filteredProducts.slice(0, 5).map(product => (
                <button
                  key={product.name}
                  onClick={() => addItem(product)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{product.name}</div>
                      <div className="text-gray-400 text-sm">{product.unitPrice.toFixed(2)} FCFA {product.quantity} available</div>
                    </div>
                    <Plus className="w-4 h-4 text-cyan-400" />
                  </div>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="px-4 py-3 text-gray-400 text-center">No products found</div>
              )}
            </div>
          )}
        </div>

        {/* Sale Items */}
        {saleItems.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sale Items</label>
            <div className="space-y-2">
              {saleItems.map(item => {
                const product = products.find(p => p.name === item.name);
                return (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-gray-400 text-sm">Unit Price: {item.unitPrice.toFixed(2)} FCFA</div>
                      <div className="text-gray-400 text-sm">Sold Price: <input type="number" value={item.soldPrice} min={0} step={0.01} onChange={e => updateSoldPrice(item.name, parseFloat(e.target.value) || item.unitPrice)} className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center text-white" /></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => updateItemQuantity(item.name, item.quantity - 1)} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white flex items-center justify-center">-</button>
                        <input type="number" value={item.quantity} onChange={(e) => updateItemQuantity(item.name, parseInt(e.target.value) || 1)} min={1} max={product?.quantity || 1} className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center text-white" />
                        <button onClick={() => updateItemQuantity(item.name, item.quantity + 1)} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white flex items-center justify-center">+</button>
                      </div>
                      <div className="text-cyan-400 font-medium w-20 text-right">FCFA {item.totalPrice.toFixed(2)}</div>
                      <button onClick={() => removeItem(item.name)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Total */}
        {saleItems.length > 0 && (
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-white">Total Amount:</span>
              <span className="text-cyan-400">{`FCFA ${totalAmount.toFixed(2)}`}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saleItems.length === 0}
          >
            Complete Sale
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SalesPage;