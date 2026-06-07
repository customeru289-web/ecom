import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { couponAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '', description: '', discountType: 'percentage', discountValue: '',
    minOrderAmount: 0, maxDiscount: 0, usageLimit: 0, expiresAt: '',
  });

  const fetch = () => couponAPI.getAll().then(({ data }) => setCoupons(data.coupons));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await couponAPI.create(form);
      toast.success('Coupon created');
      setShowForm(false);
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete coupon?')) return;
    try { await couponAPI.delete(id); toast.success('Deleted'); fetch(); } catch (err) { toast.error(err.message); }
  };

  return (
    <>
      <Helmet><title>Coupons | Admin</title></Helmet>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><FiPlus /> Add Coupon</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
          {['code', 'description', 'discountValue', 'minOrderAmount', 'maxDiscount', 'usageLimit'].map((f) => (
            <input key={f} placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required={['code', 'discountValue'].includes(f)} className="input-field" />
          ))}
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="input-field">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
          <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required className="input-field" />
          <button type="submit" className="btn-primary sm:col-span-2">Create Coupon</button>
        </form>
      )}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-zinc-500 border-b border-zinc-200/50 dark:border-zinc-700/50">
            <th className="p-4">Code</th><th className="p-4">Discount</th><th className="p-4">Used</th><th className="p-4">Expires</th><th className="p-4"></th>
          </tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b border-zinc-200/30 dark:border-zinc-700/30">
                <td className="p-4 font-mono font-bold text-gold-500">{c.code}</td>
                <td className="p-4">{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                <td className="p-4">{c.usedCount}/{c.usageLimit || '∞'}</td>
                <td className="p-4">{formatDate(c.expiresAt)}</td>
                <td className="p-4"><button onClick={() => handleDelete(c._id)} className="text-red-500"><FiTrash2 /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminCoupons;
