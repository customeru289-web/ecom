import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { authAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import Pagination from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/Skeletons';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    authAPI.getUsers({ page, limit: 10 })
      .then(({ data }) => { setUsers(data.users); setPages(data.pages); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <Helmet><title>Customers | Admin</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Customers</h1>
      <div className="glass-card overflow-hidden">
        {loading ? <div className="p-6"><TableSkeleton cols={5} /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-200/50 dark:border-zinc-700/50">
                  <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Joined</th><th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-zinc-200/30 dark:border-zinc-700/30">
                    <td className="p-4"><Link to={`/admin/customers/${u._id}`} className="text-gold-500 hover:underline">{u.name}</Link></td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 capitalize">{u.role}</td>
                    <td className="p-4">{formatDate(u.createdAt)}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${u.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
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

export default AdminCustomers;
