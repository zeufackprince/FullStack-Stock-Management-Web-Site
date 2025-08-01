import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStock } from '../context/StockContext';
import { ArrowRight, Star, TrendingUp, Package, ShoppingCart, Truck } from 'lucide-react';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const { products, getLowStockProducts } = useStock();
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = products.slice(0, 3);
  const lowStockCount = getLowStockProducts().length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/20" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Manage Your{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Inventory
              </span>{' '}
              Like a Pro
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete stock management solution with real-time tracking, advanced analytics, and seamless operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" icon={ArrowRight}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Carousel */}
          {featuredProducts.length > 0 && (
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-gray-800/50 backdrop-blur-sm">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredProducts.map((product, index) => (
                    <div key={product.id} className="w-full flex-shrink-0 p-8">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-cyan-400 mb-2">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">Featured Product</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">{product.name}</h3>
                          <p className="text-gray-300 mb-4">{product.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-cyan-400">
                               FCFA {product.unitPrice.toFixed(2)}
                            </span>
                            <span className="text-gray-500">
                              {product.quantity} in stock
                            </span>
                          </div>
                        </div>
                        <div className="w-64 h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                          <Package className="w-16 h-16 text-cyan-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-cyan-400 scale-110'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Manage Stock
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From inventory tracking to sales management, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Package}
              title="Product Management"
              description="Add, edit, and organize your products with detailed tracking and low-stock alerts"
              link="/products"
              count={products.length}
              label="Products"
            />
            <FeatureCard
              icon={ShoppingCart}
              title="Sales Tracking"
              description="Record sales, generate receipts, and track revenue with comprehensive analytics"
              link="/sales"
              count={0}
              label="Sales Today"
            />
            <FeatureCard
              icon={Truck}
              title="Inventory Restocking"
              description="Manage restocking operations with real-time inventory updates and validation"
              link="/restock"
              count={lowStockCount}
              label="Low Stock Items"
              alert={lowStockCount > 0}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard
              icon={Package}
              value={products.length}
              label="Total Products"
            />
            <StatCard
              icon={TrendingUp}
              value={products.reduce((sum, p) => sum + p.quantity, 0)}
              label="Items in Stock"
            />
            <StatCard
              icon={ShoppingCart}
              value={0}
              label="Sales This Month"
            />
            <StatCard
              icon={Star}
              value={featuredProducts.length}
              label="Featured Items"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  count: number;
  label: string;
  alert?: boolean;
}> = ({ icon: Icon, title, description, link, count, label, alert }) => (
  <Link to={link} className="group">
    <div className="h-full p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-cyan-500/50 hover:bg-gray-800/80 transition-all duration-300 group-hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${alert ? 'text-red-400' : 'text-cyan-400'}`}>
            {count}
          </div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
        {description}
      </p>
    </div>
  </Link>
);

const StatCard: React.FC<{
  icon: React.ElementType;
  value: number;
  label: string;
}> = ({ icon: Icon, value, label }) => (
  <div className="text-center p-6">
    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg mb-4">
      <Icon className="w-8 h-8 text-cyan-400" />
    </div>
    <div className="text-3xl font-bold text-white mb-2">{value.toLocaleString()}</div>
    <div className="text-gray-400">{label}</div>
  </div>
);

export default HomePage;