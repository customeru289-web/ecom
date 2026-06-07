import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate, orderStatusColor, getImageUrl } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id).then(({ data }) => setOrder(data.order)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) return null;

  const trackingSteps = ['not_shipped', 'in_transit', 'out_for_delivery', 'delivered'];
  const currentStep = trackingSteps.indexOf(order.trackingStatus);

  return (
    <div className="glass-card p-6 md:p-8">
      <Link to="/dashboard/orders" className="text-sm text-gold-500 hover:underline mb-4 inline-block">← Back to Orders</Link>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-semibold text-xl">{order.orderNumber}</h2>
          <p className="text-sm text-zinc-500">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${orderStatusColor(order.status)}`}>{order.status}</span>
      </div>

      <div className="mb-8">
        <h3 className="font-medium mb-4">Tracking Status</h3>
        <div className="flex items-center gap-2">
          {trackingSteps.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentStep ? 'bg-gold-500 text-zinc-900' : 'bg-zinc-200 dark:bg-zinc-700'}`}>{i + 1}</div>
              {i < trackingSteps.length - 1 && <div className={`flex-1 h-1 ${i < currentStep ? 'bg-gold-500' : 'bg-zinc-200 dark:bg-zinc-700'}`} />}
            </div>
          ))}
        </div>
        {order.trackingNumber && <p className="text-sm text-zinc-500 mt-2">Tracking: {order.trackingNumber}</p>}
      </div>

      <div className="space-y-4 mb-8">
        {order.orderItems.map((item, i) => (
          <div key={i} className="flex gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
            <img src={getImageUrl(item.image)} alt="" className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Shipping Address</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
        </div>
        <div className="text-sm space-y-2">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shippingPrice)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
          {order.couponDiscount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-{formatPrice(order.couponDiscount)}</span></div>}
          <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span className="text-gold-500">{formatPrice(order.totalPrice)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
