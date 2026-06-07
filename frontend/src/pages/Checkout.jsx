import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI, contentAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from '../components/common/ProtectedRoute';

const CheckoutForm = () => {
  const { user } = useAuth();
  const { cart, summary, fetchCart } = useCart();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'cod',
    notes: '',
  });

  useEffect(() => {
    fetchCart();
    contentAPI.getSettings().then(({ data }) => setSettings(data.settings)).catch(() => {});
    if (user?.addresses?.length) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      if (defaultAddr) {
        setForm((f) => ({
          ...f,
          fullName: defaultAddr.fullName,
          phone: defaultAddr.phone,
          street: defaultAddr.street,
          city: defaultAddr.city,
          state: defaultAddr.state,
          zipCode: defaultAddr.zipCode,
          country: defaultAddr.country,
        }));
      }
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart?.items?.length) return toast.error('Cart is empty');

    setLoading(true);
    try {
      if (form.paymentMethod === 'stripe') {
        const { data } = await orderAPI.createStripeIntent();
        toast.success('Stripe payment structure ready. Client secret received.');
        console.log('Stripe client secret:', data.clientSecret);
      }

      const { data } = await orderAPI.create({
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        isPaid: form.paymentMethod === 'stripe',
        notes: form.notes,
      });

      toast.success('Order placed successfully!');
      navigate(`/dashboard/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return <LoadingSpinner fullScreen />;

  return (
    <>
      <Helmet><title>Checkout | Luxora</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="section-title mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Shipping Address</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: 'fullName', label: 'Full Name', col: 2 },
                  { name: 'phone', label: 'Phone' },
                  { name: 'street', label: 'Street Address', col: 2 },
                  { name: 'city', label: 'City' },
                  { name: 'state', label: 'State' },
                  { name: 'zipCode', label: 'ZIP Code' },
                  { name: 'country', label: 'Country' },
                ].map(({ name, label, col }) => (
                  <div key={name} className={col === 2 ? 'sm:col-span-2' : ''}>
                    <label className="text-sm font-medium mb-1 block">{label}</label>
                    <input name={name} value={form[name]} onChange={handleChange} required className="input-field" />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                {settings?.codEnabled !== false && (
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 cursor-pointer hover:border-gold-500/50 transition-colors">
                    <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === 'cod'} onChange={handleChange} />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-zinc-500">Pay when you receive your order</p>
                    </div>
                  </label>
                )}
                {settings?.stripeEnabled && (
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 cursor-pointer hover:border-gold-500/50 transition-colors">
                    <input type="radio" name="paymentMethod" value="stripe" checked={form.paymentMethod === 'stripe'} onChange={handleChange} />
                    <div>
                      <p className="font-medium">Credit/Debit Card (Stripe)</p>
                      <p className="text-sm text-zinc-500">Secure payment via Stripe</p>
                    </div>
                  </label>
                )}
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium mb-1 block">Order Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input-field" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 h-fit">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm max-h-48 overflow-y-auto">
              {cart.items?.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span className="text-zinc-500 truncate mr-2">{item.product?.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200/50 dark:border-zinc-700/50 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(summary?.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{summary?.shipping === 0 ? 'FREE' : formatPrice(summary?.shipping)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatPrice(summary?.tax)}</span></div>
              {summary?.discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-{formatPrice(summary.discount)}</span></div>}
              <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span className="text-gold-500">{formatPrice(summary?.total)}</span></div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const Checkout = () => (
  <ProtectedRoute>
    <CheckoutForm />
  </ProtectedRoute>
);

export default Checkout;
