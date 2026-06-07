import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingBag, FiHeart, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { productAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { wishlistAPI } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productAPI.getById(id),
      productAPI.getRelated(id),
      reviewAPI.getByProduct(id),
    ])
      .then(([prod, rel, rev]) => {
        setProduct(prod.data.product);
        setRelated(rel.data.products);
        setReviews(rev.data.reviews);
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    try {
      await wishlistAPI.toggle(product._id);
      toast.success('Wishlist updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to review');
    setSubmitting(true);
    try {
      await reviewAPI.create(id, reviewForm);
      toast.success('Review submitted for approval');
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return null;

  const images = product.images?.length ? product.images : [''];

  return (
    <>
      <Helmet><title>{product.name} | Luxora</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <div
              className="glass-card overflow-hidden aspect-square relative cursor-zoom-in"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              <img
                src={getImageUrl(images[selectedImage])}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${zoom ? 'scale-150' : 'scale-100'}`}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      i === selectedImage ? 'border-gold-500' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-gold-500 text-sm font-medium uppercase tracking-wider">{product.category?.name}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-gold-500 fill-gold-500' : 'text-zinc-300'}`} />
                ))}
              </div>
              <span className="text-sm text-zinc-500">({product.numReviews} reviews)</span>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-3xl font-bold text-gold-500">{formatPrice(product.price)}</span>
              {product.comparePrice > product.price && (
                <span className="text-xl text-zinc-400 line-through">{formatPrice(product.comparePrice)}</span>
              )}
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 mt-6 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2 mt-4">
              {product.stock > 0 ? (
                <span className="flex items-center gap-1 text-green-500 text-sm"><FiCheck /> In Stock ({product.stock})</span>
              ) : (
                <span className="text-red-500 text-sm">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center glass rounded-full">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3"><FiMinus /></button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3"><FiPlus /></button>
                </div>
                <button onClick={handleAddToCart} className="btn-primary flex-1">
                  <FiShoppingBag /> Add to Cart
                </button>
                <button onClick={handleWishlist} className="btn-secondary p-3">
                  <FiHeart />
                </button>
              </div>
            )}

            {product.specifications?.length > 0 && (
              <div className="mt-10">
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="glass-card divide-y divide-zinc-200/50 dark:divide-zinc-700/50">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex justify-between px-4 py-3 text-sm">
                      <span className="text-zinc-500">{spec.key}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="section-title mb-8">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4 mb-8">
              {reviews.map((r) => (
                <div key={r._id} className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center font-bold text-gold-500">
                      {r.name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <div className="flex">{Array.from({ length: r.rating }).map((_, i) => (
                        <FiStar key={i} className="w-3 h-3 text-gold-500 fill-gold-500" />
                      ))}</div>
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 mb-8">No reviews yet. Be the first to review!</p>
          )}

          {isAuthenticated && (
            <form onSubmit={handleReview} className="glass-card p-6 max-w-xl">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className="input-field mb-3">
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your experience..."
                required
                rows={4}
                className="input-field mb-4"
              />
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
