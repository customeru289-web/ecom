import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="font-semibold text-xl mb-6">Profile Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {['name', 'email', 'phone'].map((field) => (
          <div key={field}>
            <label className="text-sm font-medium mb-1 block capitalize">{field}</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="input-field"
            />
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
};

export default Profile;
