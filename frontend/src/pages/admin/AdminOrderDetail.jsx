import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate, getImageUrl } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ status: '', trackingNumber: '', trackingStatus: '' });

  useEffect(() => {
    orderAPI.getById(id).then(({ data }) => {
      setOrder(data.order);
      setForm({ status: data.order.status, trackingNumber: data.order.trackingNumber, trackingStatus: data.order.trackingStatus });
    }).finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await orderAPI.update(id, form);
      setOrder(data.order);
      toast.success('Order updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!order) return null;

  return (
    <div>
      <Link to="/admin/orders" className="text-sm text-gold-500 hover:underline mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-bold mb-8">{order.orderNumber}</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4">Order Items</h2>
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex gap-3 py-3 border-b border-zinc-200/30 dark:border-zinc-700/30 last:border-0">
              <img src={getImageUrl(item.image)} alt="" className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1"><p className="font-medium">{item.name}</p><p className="text-sm text-zinc-500">x{item.quantity}</p></div>
              <p>{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t font-bold flex justify-between"><span>Total</span><span className="text-gold-500">{formatPrice(order.totalPrice)}</span></div>
        </div>
        <form onSubmit={handleUpdate} className="glass-card p-6 space-y-4">
          <h2 className="font-semibold mb-2">Update Order</h2>
          <p className="text-sm text-zinc-500">Customer: {order.user?.name} ({order.user?.email})</p>
          <p className="text-sm text-zinc-500">Date: {formatDate(order.createdAt)}</p>
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tracking Number</label>
            <input value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tracking Status</label>
            <select value={form.trackingStatus} onChange={(e) => setForm({ ...form, trackingStatus: e.target.value })} className="input-field">
              {['not_shipped', 'in_transit', 'out_for_delivery', 'delivered'].map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary">Update Order</button>
        </form>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
