import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiShoppingCart, FiUsers, FiStar, FiTag,
  FiImage, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX, FiHome,
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

const navItems = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/categories', icon: FiGrid, label: 'Categories' },
  { to: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
  { to: '/admin/customers', icon: FiUsers, label: 'Customers' },
  { to: '/admin/reviews', icon: FiStar, label: 'Reviews' },
  { to: '/admin/coupons', icon: FiTag, label: 'Coupons' },
  { to: '/admin/banners', icon: FiImage, label: 'Banners' },
  { to: '/admin/testimonials', icon: FiMessageSquare, label: 'Testimonials' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full">
      <div className="p-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <Link to="/admin" className="font-display text-xl font-bold">
          Lux<span className="text-gold-500">ora</span>
          <span className="block text-xs font-sans font-normal text-zinc-500 mt-1">Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive(to, end)
                ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-2">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <FiHome className="w-5 h-5" /> View Store
        </Link>
        <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
          <FiLogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-zinc-100 dark:bg-zinc-950">
      <div className="hidden lg:block w-64 glass border-r border-zinc-200/50 dark:border-zinc-800/50 fixed h-full">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 glass">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2">
              <FiX className="w-5 h-5" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 glass border-b border-zinc-200/50 dark:border-zinc-800/50 px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg glass">
            <FiMenu className="w-5 h-5" />
          </button>
          <p className="text-sm text-zinc-500 hidden sm:block">Welcome, {user?.name}</p>
          <ThemeToggle />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
