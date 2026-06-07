import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { cart, summary, loading, fetchCart, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="w-16 h-16 mx-auto text-zinc-400 mb-4" />
        <h2 className="section-title mb-4">Your cart is empty</h2>
        <p className="text-zinc-500 mb-8">Please login to view your cart</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  const items = cart?.items || [];

  const handleCoupon = async (e) => {
    e.preventDefault();
    setCouponLoading(true);
    try {
      await applyCoupon(couponCode);
      toast.success('Coupon applied!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Cart | Luxora</title></Helmet>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <FiShoppingBag className="w-16 h-16 mx-auto text-zinc-400 mb-4" />
          <h2 className="section-title mb-4">Your cart is empty</h2>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Cart ({items.length}) | Luxora</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="section-title mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="glass-card p-4 flex gap-4">
                <Link to={`/product/${item.product?._id}`} className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0">
                  <img src={getImageUrl(item.product?.images?.[0])} alt="" className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product?._id}`} className="font-medium hover:text-gold-500 transition-colors line-clamp-2">
                    {item.product?.name}
                  </Link>
                  <p className="text-gold-500 font-bold mt-2">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center glass rounded-full">
                      <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} className="p-2"><FiMinus className="w-4 h-4" /></button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2"><FiPlus className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="font-bold hidden sm:block">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-6 h-fit sticky top-24">
            <h3 className="font-semibold text-lg mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span>{formatPrice(summary?.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Shipping</span><span>{summary?.shipping === 0 ? 'FREE' : formatPrice(summary?.shipping)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Tax</span><span>{formatPrice(summary?.tax)}</span></div>
              {summary?.discount > 0 && (
                <div className="flex justify-between text-green-500"><span>Discount</span><span>-{formatPrice(summary.discount)}</span></div>
              )}
              <div className="border-t border-zinc-200/50 dark:border-zinc-700/50 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span><span className="text-gold-500">{formatPrice(summary?.total)}</span>
              </div>
            </div>

            <form onSubmit={handleCoupon} className="mt-6 flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="input-field flex-1 text-sm py-2"
              />
              <button type="submit" disabled={couponLoading} className="btn-secondary text-sm py-2 px-4">Apply</button>
            </form>
            {cart?.couponCode && (
              <button onClick={removeCoupon} className="text-sm text-red-500 mt-2">Remove coupon ({cart.couponCode})</button>
            )}

            <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-6">
              Proceed to Checkout
            </button>
            <Link to="/shop" className="block text-center text-sm text-zinc-500 mt-4 hover:text-gold-500">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
