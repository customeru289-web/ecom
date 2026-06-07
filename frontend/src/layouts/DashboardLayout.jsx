import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiMapPin, FiHeart, FiLock } from 'react-icons/fi';

const tabs = [
  { to: '/dashboard', icon: FiUser, label: 'Profile', end: true },
  { to: '/dashboard/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/dashboard/addresses', icon: FiMapPin, label: 'Addresses' },
  { to: '/dashboard/wishlist', icon: FiHeart, label: 'Wishlist' },
  { to: '/dashboard/password', icon: FiLock, label: 'Password' },
];

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="section-title mb-8">My Account</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <nav className="lg:w-64 shrink-0">
          <div className="glass-card p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map(({ to, icon: Icon, label, end }) => {
              const active = end ? location.pathname === to : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    active ? 'bg-gold-500/10 text-gold-500' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
