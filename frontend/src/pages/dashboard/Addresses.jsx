import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const emptyAddress = { label: 'Home', fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'United States', isDefault: false };

const Addresses = () => {
  const { user, loadUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.addAddress(form);
      await loadUser();
      setShowForm(false);
      setForm(emptyAddress);
      toast.success('Address added');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await authAPI.deleteAddress(id);
      await loadUser();
      toast.success('Address deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-xl">Saved Addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-secondary text-sm py-2 px-4"><FiPlus /> Add</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-3">
          {['fullName', 'phone', 'street', 'city', 'state', 'zipCode', 'country'].map((f) => (
            <input key={f} placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required className="input-field" />
          ))}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Set as default</label>
          <button type="submit" disabled={loading} className="btn-primary text-sm">Save Address</button>
        </form>
      )}

      <div className="space-y-4">
        {user?.addresses?.length ? user.addresses.map((addr) => (
          <div key={addr._id} className="p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 flex justify-between">
            <div>
              {addr.isDefault && <span className="text-xs bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded-full">Default</span>}
              <p className="font-medium mt-1">{addr.fullName}</p>
              <p className="text-sm text-zinc-500">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
              <p className="text-sm text-zinc-500">{addr.phone}</p>
            </div>
            <button onClick={() => handleDelete(addr._id)} className="text-red-500 p-2"><FiTrash2 /></button>
          </div>
        )) : (
          <p className="text-zinc-500">No saved addresses</p>
        )}
      </div>
    </div>
  );
};

export default Addresses;
