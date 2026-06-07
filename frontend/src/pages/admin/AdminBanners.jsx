import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { contentAPI } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ title: '', subtitle: '', link: '/shop', buttonText: 'Shop Now', order: 0 });
  const [image, setImage] = useState(null);

  const fetch = () => contentAPI.getBanners().then(({ data }) => setBanners(data.banners));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    try {
      await contentAPI.createBanner(fd);
      toast.success('Banner created');
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete banner?')) return;
    try { await contentAPI.deleteBanner(id); toast.success('Deleted'); fetch(); } catch (err) { toast.error(err.message); }
  };

  return (
    <>
      <Helmet><title>Banners | Admin</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Homepage Banners</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
        {['title', 'subtitle', 'link', 'buttonText'].map((f) => (
          <input key={f} placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required={f === 'title'} className="input-field" />
        ))}
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required className="input-field sm:col-span-2" />
        <button type="submit" className="btn-primary sm:col-span-2"><FiPlus /> Add Banner</button>
      </form>
      <div className="grid md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b._id} className="glass-card overflow-hidden">
            <img src={getImageUrl(b.image)} alt={b.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex justify-between items-start">
              <div><p className="font-medium">{b.title}</p><p className="text-sm text-zinc-500">{b.subtitle}</p></div>
              <button onClick={() => handleDelete(b._id)} className="text-red-500 p-2"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminBanners;
