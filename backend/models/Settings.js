import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'Luxora' },
    tagline: { type: String, default: 'Premium Luxury Shopping' },
    logo: { type: String, default: '' },
    contactEmail: { type: String, default: 'support@luxora.com' },
    contactPhone: { type: String, default: '+1 (555) 123-4567' },
    address: { type: String, default: '123 Luxury Avenue, New York, NY 10001' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    shippingCost: { type: Number, default: 9.99 },
    freeShippingThreshold: { type: Number, default: 100 },
    taxRate: { type: Number, default: 8 },
    currency: { type: String, default: 'USD' },
    stripeEnabled: { type: Boolean, default: true },
    stripePublicKey: { type: String, default: '' },
    codEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
