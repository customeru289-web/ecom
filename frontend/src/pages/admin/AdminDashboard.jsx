import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminAPI } from '../../services/api';
import { formatPrice, formatDate, orderStatusColor } from '../../utils/helpers';
import { DashboardSkeleton } from '../../components/common/Skeletons';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}><Icon className="w-6 h-6" /></div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(({ data: d }) => setData(d)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const { stats, monthlyRevenue, recentOrders } = data;

  return (
    <>
      <Helmet><title>Admin Dashboard | Luxora</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiDollarSign} label="Total Sales" value={formatPrice(stats.totalSales)} color="bg-green-500/10 text-green-500" />
        <StatCard icon={FiShoppingCart} label="Total Orders" value={stats.totalOrders} color="bg-blue-500/10 text-blue-500" />
        <StatCard icon={FiUsers} label="Total Customers" value={stats.totalCustomers} color="bg-purple-500/10 text-purple-500" />
        <StatCard icon={FiPackage} label="Total Products" value={stats.totalProducts} color="bg-gold-500/10 text-gold-500" />
      </div>

      <div className="glass-card p-6 mb-8">
        <h2 className="font-semibold mb-6">Revenue Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="_id" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip contentStyle={{ background: '#18181b', border: 'none', borderRadius: '12px' }} />
            <Area type="monotone" dataKey="revenue" stroke="#c5a028" fill="#c5a028" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-200/50 dark:border-zinc-700/50">
                <th className="pb-3 pr-4">Order</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-zinc-200/30 dark:border-zinc-700/30">
                  <td className="py-3 pr-4"><Link to={`/admin/orders/${order._id}`} className="text-gold-500 hover:underline">{order.orderNumber}</Link></td>
                  <td className="py-3 pr-4">{order.user?.name}</td>
                  <td className="py-3 pr-4">{formatDate(order.createdAt)}</td>
                  <td className="py-3 pr-4"><span className={`px-2 py-1 rounded-full text-xs capitalize ${orderStatusColor(order.status)}`}>{order.status}</span></td>
                  <td className="py-3 font-medium">{formatPrice(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
