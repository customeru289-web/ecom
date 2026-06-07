import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-4">
              Lux<span className="text-gold-500">ora</span>
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Premium luxury shopping experience. Curated collections of the finest watches, jewelry, and accessories.
            </p>
            <div className="flex gap-3 mt-6">
              {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-gold-500 hover:text-zinc-900 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/shop', label: 'Shop All' },
                { to: '/shop?sort=popular', label: 'Best Sellers' },
                { to: '/shop?sort=latest', label: 'New Arrivals' },
                { to: '/cart', label: 'Shopping Cart' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-gold-500 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              {['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'FAQ', 'Privacy Policy'].map((item) => (
                <li key={item}><a href="#" className="hover:text-gold-500 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><FiMapPin className="w-4 h-4 text-gold-500" /> 123 Luxury Ave, NY 10001</li>
              <li className="flex items-center gap-2"><FiPhone className="w-4 h-4 text-gold-500" /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><FiMail className="w-4 h-4 text-gold-500" /> support@luxora.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Luxora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
