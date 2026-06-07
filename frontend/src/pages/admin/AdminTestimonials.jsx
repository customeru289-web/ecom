import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { contentAPI } from '../../services/api';

const AdminTestimonials = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', role: 'Verified Customer', rating: 5, comment: '' });

  const fetch = () => contentAPI.getTestimonials().then(({ data }) => setItems(data.testimonials));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.createTestimonial(form);
      toast.success('Testimonial added');
      setForm({ name: '', role: 'Verified Customer', rating: 5, comment: '' });
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await contentAPI.deleteTestimonial(id); fetch(); } catch (err) { toast.error(err.message); }
  };

  return (
    <>
      <Helmet><title>Testimonials | Admin</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Testimonials</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 space-y-4 max-w-xl">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
        <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field" />
        <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="input-field">
          {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
        </select>
        <textarea placeholder="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} required rows={3} className="input-field" />
        <button type="submit" className="btn-primary"><FiPlus /> Add Testimonial</button>
      </form>
      <div className="space-y-4">
        {items.map((t) => (
          <div key={t._id} className="glass-card p-4 flex justify-between">
            <div><p className="font-medium">{t.name} · {t.rating}★</p><p className="text-sm mt-1">{t.comment}</p></div>
            <button onClick={() => handleDelete(t._id)} className="text-red-500 p-2"><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminTestimonials;
