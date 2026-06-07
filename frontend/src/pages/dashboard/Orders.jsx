import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate, orderStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMy().then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="font-semibold text-xl mb-6">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-zinc-500">No orders yet. <Link to="/shop" className="text-gold-500">Start shopping</Link></p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/dashboard/orders/${order._id}`} className="block p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 hover:border-gold-500/30 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-zinc-500">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${orderStatusColor(order.status)}`}>{order.status}</span>
                <p className="font-bold text-gold-500">{formatPrice(order.totalPrice)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
