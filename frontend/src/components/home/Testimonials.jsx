import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { contentAPI } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    contentAPI.getTestimonials().then(({ data }) => setTestimonials(data?.testimonials ?? [])).catch(() => {});
  }, []);

  if (!testimonials?.length) return null;

  return (
    <section className="py-16 md:py-24 bg-zinc-100/50 dark:bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title text-center mb-12"
        >
          What Our Customers Say
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 md:p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <FiStar key={j} className="w-4 h-4 text-gold-500 fill-gold-500" />
                ))}
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed italic">&ldquo;{t.comment}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6">
                <img
                  src={getImageUrl(t.avatar) || `https://ui-avatars.com/api/?name=${t.name}&background=c5a028&color=fff`}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-zinc-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
