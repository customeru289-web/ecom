import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { contentAPI } from '../../services/api';

const AdminSettings = () => {
  const [form, setForm] = useState({
    storeName: '', tagline: '', contactEmail: '', contactPhone: '', address: '',
    shippingCost: '', freeShippingThreshold: '', taxRate: '',
    stripeEnabled: false, stripePublicKey: '', codEnabled: true,
    socialLinks: { facebook: '', instagram: '', twitter: '', youtube: '' },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    contentAPI.getSettings().then(({ data }) => {
      const s = data.settings;
      setForm({
        storeName: s.storeName || '', tagline: s.tagline || '', contactEmail: s.contactEmail || '',
        contactPhone: s.contactPhone || '', address: s.address || '',
        shippingCost: s.shippingCost || '', freeShippingThreshold: s.freeShippingThreshold || '',
        taxRate: s.taxRate || '', stripeEnabled: s.stripeEnabled, stripePublicKey: s.stripePublicKey || '',
        codEnabled: s.codEnabled, socialLinks: s.socialLinks || {},
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contentAPI.updateSettings(form);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Settings | Admin</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Store Settings</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 max-w-2xl space-y-6">
        <div>
          <h2 className="font-semibold mb-4">Store Information</h2>
          <div className="space-y-3">
            {['storeName', 'tagline', 'contactEmail', 'contactPhone', 'address'].map((f) => (
              <input key={f} placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="input-field" />
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-4">Shipping & Tax</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {['shippingCost', 'freeShippingThreshold', 'taxRate'].map((f) => (
              <input key={f} type="number" placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="input-field" />
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-4">Payment Settings</h2>
          <label className="flex items-center gap-2 mb-3"><input type="checkbox" checked={form.codEnabled} onChange={(e) => setForm({ ...form, codEnabled: e.target.checked })} /> Cash on Delivery</label>
          <label className="flex items-center gap-2 mb-3"><input type="checkbox" checked={form.stripeEnabled} onChange={(e) => setForm({ ...form, stripeEnabled: e.target.checked })} /> Stripe Enabled</label>
          <input placeholder="Stripe Public Key" value={form.stripePublicKey} onChange={(e) => setForm({ ...form, stripePublicKey: e.target.value })} className="input-field" />
        </div>
        <div>
          <h2 className="font-semibold mb-4">Social Links</h2>
          {['facebook', 'instagram', 'twitter', 'youtube'].map((s) => (
            <input key={s} placeholder={s} value={form.socialLinks[s] || ''} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [s]: e.target.value } })} className="input-field mb-2" />
          ))}
        </div>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Settings'}</button>
      </form>
    </>
  );
};

export default AdminSettings;
