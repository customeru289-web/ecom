import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contentAPI } from '../../services/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contentAPI.subscribeNewsletter(email);
      toast.success('Successfully subscribed!');
      setEmail('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Join Our Newsletter</h2>
            <p className="text-zinc-500 mt-3 max-w-md mx-auto">
              Subscribe for exclusive offers, new arrivals, and luxury lifestyle content.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="input-field flex-1"
              />
              <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
