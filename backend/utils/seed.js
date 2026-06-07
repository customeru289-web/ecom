import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Banner from '../models/Banner.js';
import Testimonial from '../models/Testimonial.js';
import Settings from '../models/Settings.js';

dotenv.config();
dns.setDefaultResultOrder('ipv4first');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany(), Category.deleteMany(), Product.deleteMany(),
      Coupon.deleteMany(), Banner.deleteMany(), Testimonial.deleteMany(), Settings.deleteMany(),
    ]);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@luxora.com',
      password: 'admin123',
      role: 'admin',
    });

    const customer = await User.create({
      name: 'John Doe',
      email: 'customer@luxora.com',
      password: 'customer123',
      role: 'user',
    });

    const categories = await Category.insertMany([
      { name: 'Watches', slug: 'watches', description: 'Luxury timepieces', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
      { name: 'Jewelry', slug: 'jewelry', description: 'Fine jewelry collection', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600' },
      { name: 'Bags', slug: 'bags', description: 'Designer handbags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600' },
      { name: 'Accessories', slug: 'accessories', description: 'Premium accessories', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600' },
    ]);

    const products = [
      { name: 'Royal Chronograph Watch', slug: 'royal-chronograph-watch', description: 'Swiss-made luxury chronograph with sapphire crystal and leather strap.', price: 2499, comparePrice: 2999, category: categories[0]._id, stock: 15, featured: true, bestSeller: true, newArrival: true, rating: 4.8, numReviews: 24, salesCount: 156, images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'], specifications: [{ key: 'Movement', value: 'Automatic' }, { key: 'Case', value: 'Stainless Steel' }] },
      { name: 'Diamond Elegance Ring', slug: 'diamond-elegance-ring', description: '18K white gold ring with brilliant cut diamonds.', price: 3899, comparePrice: 4500, category: categories[1]._id, stock: 8, featured: true, bestSeller: true, rating: 4.9, numReviews: 18, salesCount: 89, images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'], specifications: [{ key: 'Material', value: '18K White Gold' }] },
      { name: 'Milano Leather Tote', slug: 'milano-leather-tote', description: 'Handcrafted Italian leather tote bag with gold hardware.', price: 1899, comparePrice: 2200, category: categories[2]._id, stock: 20, featured: true, newArrival: true, rating: 4.7, numReviews: 32, salesCount: 201, images: ['https://images.unsplash.com/photo-1584917865442-de89df76aed3?w=800'], specifications: [{ key: 'Material', value: 'Italian Leather' }] },
      { name: 'Platinum Cufflinks', slug: 'platinum-cufflinks', description: 'Platinum-plated cufflinks with onyx inlay.', price: 599, category: categories[3]._id, stock: 30, bestSeller: true, rating: 4.6, numReviews: 12, salesCount: 78, images: ['https://images.unsplash.com/photo-1611591437281-460bf8912046?w=800'], specifications: [{ key: 'Material', value: 'Platinum Plated' }] },
      { name: 'Heritage Gold Watch', slug: 'heritage-gold-watch', description: 'Classic gold-tone watch with Roman numerals.', price: 1799, comparePrice: 2100, category: categories[0]._id, stock: 12, newArrival: true, rating: 4.5, numReviews: 8, salesCount: 45, images: ['https://images.unsplash.com/photo-1542496658-e33a0d77c25d?w=800'], specifications: [{ key: 'Movement', value: 'Quartz' }] },
      { name: 'Pearl Necklace Set', slug: 'pearl-necklace-set', description: 'South Sea pearl necklace with matching earrings.', price: 4299, category: categories[1]._id, stock: 5, featured: true, rating: 5, numReviews: 15, salesCount: 34, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'], specifications: [{ key: 'Pearl Type', value: 'South Sea' }] },
      { name: 'Executive Briefcase', slug: 'executive-briefcase', description: 'Premium calfskin briefcase for the modern professional.', price: 2199, category: categories[2]._id, stock: 10, bestSeller: true, rating: 4.8, numReviews: 21, salesCount: 112, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'], specifications: [{ key: 'Material', value: 'Calfskin Leather' }] },
      { name: 'Silk Pocket Square', slug: 'silk-pocket-square', description: 'Hand-rolled silk pocket square with paisley pattern.', price: 149, category: categories[3]._id, stock: 50, newArrival: true, rating: 4.4, numReviews: 6, salesCount: 230, images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'], specifications: [{ key: 'Material', value: '100% Silk' }] },
    ];

    await Product.insertMany(products);
    await Category.updateMany({}, { productCount: 2 });

    await Coupon.create({
      code: 'LUXORA20',
      description: '20% off your order',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 100,
      maxDiscount: 500,
      usageLimit: 100,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });

    await Banner.insertMany([
      { title: 'Luxury Redefined', subtitle: 'Discover our exclusive collection of premium timepieces and jewelry', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600', link: '/shop', buttonText: 'Explore Collection', order: 1 },
      { title: 'Summer Collection', subtitle: 'Up to 30% off on selected items', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600', link: '/shop?sort=latest', buttonText: 'Shop Now', order: 2 },
    ]);

    await Testimonial.insertMany([
      { name: 'Sarah Mitchell', role: 'Verified Buyer', rating: 5, comment: 'Exceptional quality and service. The watch exceeded all my expectations.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
      { name: 'James Chen', role: 'Verified Buyer', rating: 5, comment: 'Fast shipping and beautifully packaged. Will definitely shop again.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
      { name: 'Emma Rodriguez', role: 'Verified Buyer', rating: 5, comment: 'The jewelry collection is stunning. True luxury at its finest.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
    ]);

    await Settings.create({
      storeName: 'Luxora',
      tagline: 'Premium Luxury Shopping',
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY || '',
    });

    console.log('Seed completed!');
    console.log('Admin: admin@luxora.com / admin123');
    console.log('Customer: customer@luxora.com / customer123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
