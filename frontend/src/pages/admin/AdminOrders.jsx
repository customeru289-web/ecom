import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate, orderStatusColor } from '../../utils/helpers';
import Pagination from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/Skeletons';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    orderAPI.getAll({ page, limit: 10, status })
      .then(({ data }) => { setOrders(data.orders); setPages(data.pages); })
      .finally(() => setLoading(false));
  }, [page, status]);

  return (
    <>
      <Helmet><title>Orders | Admin</title></Helmet>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">All Status</option>
          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="glass-card overflow-hidden">
        {loading ? <div className="p-6"><TableSkeleton /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-200/50 dark:border-zinc-700/50">
                  <th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-zinc-200/30 dark:border-zinc-700/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                    <td className="p-4"><Link to={`/admin/orders/${o._id}`} className="text-gold-500 hover:underline">{o.orderNumber}</Link></td>
                    <td className="p-4">{o.user?.name}</td>
                    <td className="p-4">{formatDate(o.createdAt)}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs capitalize ${orderStatusColor(o.status)}`}>{o.status}</span></td>
                    <td className="p-4 font-medium">{formatPrice(o.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4"><Pagination page={page} pages={pages} onPageChange={setPage} /></div>
      </div>
    </>
  );
};

export default AdminOrders;
