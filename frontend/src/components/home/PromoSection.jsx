import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PromoSection = () => (
  <section className="py-16 md:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-auto md:h-80 group"
        >
          <img
            src="https://images.unsplash.com/photo-1612817288484-6f916006177a?w=800"
            alt="Summer Sale"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-8 md:p-12">
            <div>
              <p className="text-gold-400 text-sm font-medium tracking-widest uppercase">Limited Offer</p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mt-2">Summer Collection</h3>
              <p className="text-zinc-300 mt-2">Up to 30% off selected items</p>
              <Link to="/shop" className="btn-primary mt-6 inline-flex text-sm">Shop Sale</Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-auto md:h-80 group"
        >
          <img
            src="https://images.unsplash.com/photo-1611591437281-460bf8912046?w=800"
            alt="New Members"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-8 md:p-12">
            <div>
              <p className="text-gold-400 text-sm font-medium tracking-widest uppercase">Exclusive</p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mt-2">Member Benefits</h3>
              <p className="text-zinc-300 mt-2">Free shipping on orders over $100</p>
              <Link to="/register" className="btn-secondary mt-6 inline-flex text-sm text-white border-white/20">Join Now</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PromoSection;
