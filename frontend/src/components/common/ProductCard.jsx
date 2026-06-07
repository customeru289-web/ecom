import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { wishlistAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

const ProductCard = ({ product, index = 0 }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    setWishlistLoading(true);
    try {
      await wishlistAPI.toggle(product._id);
      toast.success('Wishlist updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/product/${product._id}`} className="group block">
        <div className="glass-card overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-gold-500/10 group-hover:-translate-y-1">
          <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              src={getImageUrl(product.images?.[0])}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                -{discount}%
              </span>
            )}
            {product.newArrival && (
              <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold bg-gold-500 text-zinc-900 rounded-full">
                NEW
              </span>
            )}
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className="absolute bottom-3 right-3 p-2.5 rounded-full glass opacity-0 group-hover:opacity-100 transition-all hover:bg-gold-500/20"
            >
              <FiHeart className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              {product.category?.name || product.brand}
            </p>
            <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-gold-500 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-2">
              <FiStar className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
              <span className="text-xs text-zinc-500">{product.rating || 0} ({product.numReviews || 0})</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="font-bold text-gold-500">{formatPrice(product.price)}</span>
              {product.comparePrice > product.price && (
                <span className="text-sm text-zinc-400 line-through">{formatPrice(product.comparePrice)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
