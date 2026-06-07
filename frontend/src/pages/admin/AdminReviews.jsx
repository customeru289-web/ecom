import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { reviewAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import Pagination from '../../components/common/Pagination';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('pending');

  const fetch = () => reviewAPI.getAll({ page, limit: 10, status }).then(({ data }) => {
    setReviews(data.reviews);
    setPages(data.pages);
  });

  useEffect(() => { fetch(); }, [page, status]);

  const approve = async (id) => {
    try { await reviewAPI.approve(id); toast.success('Approved'); fetch(); } catch (err) { toast.error(err.message); }
  };

  const remove = async (id) => {
    if (!confirm('Delete review?')) return;
    try { await reviewAPI.delete(id); toast.success('Deleted'); fetch(); } catch (err) { toast.error(err.message); }
  };

  return (
    <>
      <Helmet><title>Reviews | Admin</title></Helmet>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="">All</option>
        </select>
      </div>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="glass-card p-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-medium">{r.name} · {r.rating}★</p>
                <p className="text-sm text-zinc-500">{r.product?.name} · {formatDate(r.createdAt)}</p>
                <p className="mt-2">{r.comment}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!r.isApproved && <button onClick={() => approve(r._id)} className="p-2 rounded-lg bg-green-500/10 text-green-500"><FiCheck /></button>}
                <button onClick={() => remove(r._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </>
  );
};

export default AdminReviews;
