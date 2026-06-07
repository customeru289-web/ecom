import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingBag, FiUser, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { cartCount, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?sort=latest', label: 'New Arrivals' },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Lux<span className="text-gold-500">ora</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-gold-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 rounded-full glass">
              <FiSearch className="w-5 h-5" />
            </button>
            <ThemeToggle />
            {isAuthenticated && (
              <Link to="/dashboard/wishlist" className="p-2.5 rounded-full glass hidden sm:flex">
                <FiHeart className="w-5 h-5" />
              </Link>
            )}
            <Link to="/cart" className="p-2.5 rounded-full glass relative">
              <FiShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-gold-500 text-zinc-900 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="relative group">
                <Link to={isAdmin ? '/admin' : '/dashboard'} className="p-2.5 rounded-full glass flex">
                  <FiUser className="w-5 h-5" />
                </Link>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="glass-card p-2 min-w-[160px]">
                    <p className="px-3 py-2 text-sm font-medium truncate">{user?.name}</p>
                    <Link to="/dashboard" className="block px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">Dashboard</Link>
                    {isAdmin && <Link to="/admin" className="block px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">Admin Panel</Link>}
                    <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-4 py-2 hidden sm:inline-flex">Login</Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2.5 rounded-full glass md:hidden">
              {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSearch}
              className="overflow-hidden pb-4"
            >
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="input-field"
                autoFocus
              />
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="block py-3 text-lg font-medium">
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary w-full mt-4">Login</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
