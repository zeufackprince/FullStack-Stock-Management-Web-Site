import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Calendar, ShoppingCart, Trash2, FileText } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { SaleItem } from '../types';
import { generatePDF } from '../utils/pdfGenerator';
import { createSale, getAllSales, getSaleById, getSalesByDate } from '../utils/ApiFunction';

const SalesPage: React.FC = () => {
  const [products, setProducts] = useState([]); // You may want to fetch products from backend if needed
  const [sales, setSales] = useState([]);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sales from backend
  React.useEffect(() => {
    setLoading(true);
    getAllSales()
      .then(setSales)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Add sale
  const handleAddSale = async (data: any) => {
    setLoading(true);
    try {
      await createSale(data);
      const updated = await getAllSales();
      setSales(updated);
      setIsNewSaleModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = useMemo(() => {
    let filtered = sales;

    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.items.some(item =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.timestamp);
        return saleDate.toDateString() === filterDate.toDateString();
      });
    }

    return filtered;
  }, [sales, searchTerm, dateFilter]);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const todaySales = sales.filter(sale => {
    const today = new Date();
    const saleDate = new Date(sale.timestamp);
    return saleDate.toDateString() === today.toDateString();
  });

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Sales Management</h1>
              <p className="text-gray-400">
                Track your sales and revenue • {sales.length} total sales • ${totalRevenue.toFixed(2)} revenue
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
            subtitle={`$${todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0).toFixed(2)} revenue`}
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
            value={`$${totalRevenue.toFixed(2)}`}
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

        {/* Sales Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Sale ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredSales.map((sale) => {
                  const totalQuantity = sale.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={sale.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-cyan-400">#{sale.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {sale.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-sm text-white">
                              {item.productName} x{item.quantity}
                            </div>
                          ))}
                          {sale.items.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{sale.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white">{totalQuantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-green-400">
                          ${sale.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">
                          {new Date(sale.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(sale.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={FileText}
                          onClick={() => generatePDF(sale)}
                        >
                          Receipt
                        </Button>
                      </td>
                    </tr>
                  );
                })}
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

        {/* Add/Edit Sale Modal */}
        <SaleModal
          isOpen={isNewSaleModalOpen}
          onClose={() => setIsNewSaleModalOpen(false)}
          onSave={handleAddSale}
        />
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  color: 'cyan' | 'blue' | 'green';
}> = ({ title, value, subtitle, color }) => {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-600/20 text-cyan-400',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400',
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
      <div className={`text-2xl font-bold mb-1 ${colorClasses[color].split(' ')[2]}`}>
        {value}
      </div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

const SaleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [saleData, setSaleData] = useState<any>({ items: [] });
  const [productSearch, setProductSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductSearch(e.target.value);
  };

  const handleAddProduct = (product: any) => {
    const exists = saleData.items.find((item: any) => item.productId === product.id);
    if (exists) {
      setSaleData((prev: any) => ({
        ...prev,
        items: prev.items.map((item: any) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }));
    } else {
      setSaleData((prev: any) => ({
        ...prev,
        items: [...prev.items, { productId: product.id, quantity: 1 }],
      }));
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSaleData((prev: any) => ({
      ...prev,
      items: prev.items.filter((item: any) => item.productId !== productId),
    }));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSaleData((prev: any) => ({
      ...prev,
      items: prev.items.map((item: any) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  };

  const totalAmount = saleData.items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(saleData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white">New Sale</h2>
          <p className="text-gray-400 text-sm">
            Add products to the sale and specify the quantities.
          </p>
        </div>

        {/* Product Search */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Selected Products */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Selected Products
          </label>
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            {saleData.items.length === 0 ? (
              <div className="px-4 py-3 text-gray-400 text-center">
                No products added to the sale
              </div>
            ) : (
              saleData.items.map((item: any) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-4 border-b border-gray-700"
                >
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {item.productName}
                    </div>
                    <div className="text-gray-400 text-sm">
                      ${item.unitPrice.toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="text-white">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveProduct(item.productId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center text-lg font-semibold">
          <span className="text-white">Total Amount:</span>
          <span className="text-cyan-400">${totalAmount.toFixed(2)}</span>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saleData.items.length === 0 || loading}
          >
            {loading ? 'Saving...' : 'Save Sale'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SalesPage;