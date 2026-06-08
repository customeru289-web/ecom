import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { contentAPI } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    contentAPI.getBanners().then(({ data }) => setBanners(data?.banners ?? [])).catch(() => {});
  }, []);

  const bannerList = banners ?? [];

  useEffect(() => {
    if (bannerList.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % bannerList.length), 6000);
    return () => clearInterval(timer);
  }, [bannerList.length]);

  const banner = bannerList[current] || {
    title: 'Luxury Redefined',
    subtitle: 'Discover our exclusive collection of premium timepieces and jewelry',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600',
    link: '/shop',
    buttonText: 'Explore Collection',
  };

  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <img src={getImageUrl(banner.image)} alt={banner.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </motion.div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl"
        >
          <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">Premium Collection</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            {banner.title}
          </h1>
          <p className="text-zinc-300 text-lg mt-4 leading-relaxed">{banner.subtitle}</p>
          <Link to={banner.link || '/shop'} className="btn-primary mt-8 inline-flex">
            {banner.buttonText || 'Shop Now'}
          </Link>
        </motion.div>
      </div>

      {bannerList.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerList.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'w-8 bg-gold-500' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
