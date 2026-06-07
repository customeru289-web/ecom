import { useEffect, useState } from 'react';
import { wishlistAPI } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeletons';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishlistAPI.get().then(({ data }) => setWishlist(data.wishlist)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="font-semibold text-xl mb-6">My Wishlist</h2>
      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : wishlist.length === 0 ? (
        <p className="text-zinc-500">Your wishlist is empty</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
