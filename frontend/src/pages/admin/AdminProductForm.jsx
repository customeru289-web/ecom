import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { productAPI, categoryAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', comparePrice: '', category: '', brand: 'Luxora',
    stock: '', lowStockThreshold: 5, featured: false, bestSeller: false, newArrival: false, isActive: true,
    specifications: '[]',
  });

  useEffect(() => {
    categoryAPI.getAdmin().then(({ data }) => setCategories(data.categories));
    if (isEdit) {
      productAPI.getById(id).then(({ data }) => {
        const p = data.product;
        setForm({
          name: p.name, description: p.description, price: p.price, comparePrice: p.comparePrice || '',
          category: p.category?._id || p.category, brand: p.brand, stock: p.stock,
          lowStockThreshold: p.lowStockThreshold, featured: p.featured, bestSeller: p.bestSeller,
          newArrival: p.newArrival, isActive: p.isActive,
          specifications: JSON.stringify(p.specifications || []),
        });
      }).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append('images', img));
      if (isEdit) {
        await productAPI.update(id, fd);
        toast.success('Product updated');
      } else {
        await productAPI.create(fd);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit' : 'Add'} Product | Admin</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">{isEdit ? 'Edit' : 'Add'} Product</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 max-w-2xl space-y-4">
        {['name', 'description', 'price', 'comparePrice', 'brand', 'stock', 'lowStockThreshold'].map((f) => (
          <div key={f}>
            <label className="text-sm font-medium mb-1 block capitalize">{f}</label>
            {f === 'description' ? (
              <textarea value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required rows={4} className="input-field" />
            ) : (
              <input type={['price', 'comparePrice', 'stock', 'lowStockThreshold'].includes(f) ? 'number' : 'text'} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required={!['comparePrice'].includes(f)} className="input-field" />
            )}
          </div>
        ))}
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="input-field">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Images</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="input-field" />
        </div>
        <div className="flex flex-wrap gap-4">
          {['featured', 'bestSeller', 'newArrival', 'isActive'].map((f) => (
            <label key={f} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.checked })} />
              {f.replace(/([A-Z])/g, ' $1')}
            </label>
          ))}
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : 'Save Product'}</button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </>
  );
};

export default AdminProductForm;
