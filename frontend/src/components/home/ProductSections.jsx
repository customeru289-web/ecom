import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI } from '../../services/api';
import ProductCard from '../common/ProductCard';
import { ProductGridSkeleton } from '../common/Skeletons';

const ProductSection = ({ title, subtitle, fetchFn, viewAllLink }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFn()
      .then(({ data }) => setProducts(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetchFn]);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title"
            >
              {title}
            </motion.h2>
            {subtitle && <p className="text-zinc-500 mt-2">{subtitle}</p>}
          </div>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-gold-500 text-sm font-medium hover:underline hidden sm:block">
              View All →
            </Link>
          )}
        </div>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export const FeaturedProducts = () => (
  <ProductSection
    title="Featured Products"
    subtitle="Handpicked luxury items just for you"
    fetchFn={() => productAPI.getFeatured()}
    viewAllLink="/shop"
  />
);

export const NewArrivals = () => (
  <ProductSection
    title="New Arrivals"
    subtitle="The latest additions to our collection"
    fetchFn={() => productAPI.getNewArrivals()}
    viewAllLink="/shop?sort=latest"
  />
);

export const BestSellers = () => (
  <ProductSection
    title="Best Sellers"
    subtitle="Our most loved products"
    fetchFn={() => productAPI.getBestSellers()}
    viewAllLink="/shop?sort=popular"
  />
);
