import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Home, ShoppingCart, Truck, BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-gray-900 border-b border-cyan-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              StockFlow
            </span>
          </Link>

          {!isHomePage && (
            <nav className="hidden md:flex space-x-8">
              <NavLink to="/" icon={Home} label="Home" />
              <NavLink to="/products" icon={Package} label="Products" />
              <NavLink to="/sales" icon={ShoppingCart} label="Sales" />
              <NavLink to="/restock" icon={Truck} label="Restock" />
            </nav>
          )}

          {isHomePage && (
            <div className="flex space-x-4">
              <button className="px-6 py-2 text-cyan-400 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300">
                Sign In
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300">
                Sign Up
              </button>
            </div>
          )}

          {!isHomePage && (
            <div className="md:hidden">
              <button className="text-cyan-400 hover:text-cyan-300 p-2">
                <BarChart3 className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {!isHomePage && (
          <nav className="md:hidden border-t border-gray-800 pt-4 pb-4">
            <div className="flex justify-around">
              <MobileNavLink to="/" icon={Home} label="Home" />
              <MobileNavLink to="/products" icon={Package} label="Products" />
              <MobileNavLink to="/sales" icon={ShoppingCart} label="Sales" />
              <MobileNavLink to="/restock" icon={Truck} label="Restock" />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ElementType; label: string }> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
        isActive
          ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/30'
          : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const MobileNavLink: React.FC<{ to: string; icon: React.ElementType; label: string }> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 ${
        isActive
          ? 'text-cyan-400'
          : 'text-gray-400 hover:text-cyan-400'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default Header;