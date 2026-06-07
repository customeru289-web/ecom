import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { categoryAPI } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = () => categoryAPI.getAdmin().then(({ data }) => setCategories(data.categories));

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      if (image) fd.append('image', image);
      await categoryAPI.create(fd);
      toast.success('Category created');
      setForm({ name: '', description: '' });
      setImage(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete category?')) return;
    try {
      await categoryAPI.delete(id);
      toast.success('Deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Helmet><title>Categories | Admin</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Categories</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 h-fit">
          <h2 className="font-semibold flex items-center gap-2"><FiPlus /> Add Category</h2>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="input-field" />
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Creating...' : 'Create'}</button>
        </form>
        <div className="glass-card p-6">
          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c._id} className="flex items-center gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <img src={getImageUrl(c.image)} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-zinc-500">{c.productCount} products</p>
                </div>
                <button onClick={() => handleDelete(c._id)} className="text-red-500 p-2"><FiTrash2 /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCategories;
