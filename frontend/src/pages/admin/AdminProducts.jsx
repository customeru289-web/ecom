import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { productAPI } from '../../services/api';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import Pagination from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/Skeletons';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    productAPI.getAdmin({ page, limit: 10, keyword })
      .then(({ data }) => { setProducts(data.products); setPages(data.pages); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [page, keyword]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Helmet><title>Products | Admin</title></Helmet>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new" className="btn-primary text-sm"><FiPlus /> Add Product</Link>
      </div>

      <input type="search" placeholder="Search products..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input-field max-w-sm mb-6" />

      <div className="glass-card overflow-hidden">
        {loading ? <div className="p-6"><TableSkeleton /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-200/50 dark:border-zinc-700/50">
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-zinc-200/30 dark:border-zinc-700/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={getImageUrl(p.images?.[0])} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-zinc-500">{p.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{formatPrice(p.price)}</td>
                    <td className="p-4">
                      <span className={p.stock <= p.lowStockThreshold ? 'text-red-500 flex items-center gap-1' : ''}>
                        {p.stock <= p.lowStockThreshold && <FiAlertTriangle className="w-4 h-4" />}
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link to={`/admin/products/${p._id}`} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"><FiEdit /></Link>
                        <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4"><Pagination page={page} pages={pages} onPageChange={setPage} /></div>
      </div>
    </>
  );
};

export default AdminProducts;
