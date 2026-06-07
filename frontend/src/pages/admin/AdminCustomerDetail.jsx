import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI, orderAPI } from '../../services/api';
import { formatPrice, formatDate, orderStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCustomerDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([authAPI.getUser(id), orderAPI.getUserOrders(id)])
      .then(([userRes, ordersRes]) => {
        setUser(userRes.data.user);
        setOrders(ordersRes.data.orders);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return null;

  return (
    <div>
      <Link to="/admin/customers" className="text-sm text-gold-500 hover:underline mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
      <p className="text-zinc-500 mb-8">{user.email} · Joined {formatDate(user.createdAt)}</p>
      <div className="glass-card p-6">
        <h2 className="font-semibold mb-4">Order History ({orders.length})</h2>
        {orders.length === 0 ? <p className="text-zinc-500">No orders</p> : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <Link to={`/admin/orders/${o._id}`} className="text-gold-500 hover:underline">{o.orderNumber}</Link>
                <span className={`px-2 py-1 rounded-full text-xs capitalize ${orderStatusColor(o.status)}`}>{o.status}</span>
                <span>{formatDate(o.createdAt)}</span>
                <span className="font-medium">{formatPrice(o.totalPrice)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomerDetail;
