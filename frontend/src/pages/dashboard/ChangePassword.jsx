import { useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password changed');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="font-semibold text-xl mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
          <div key={field}>
            <label className="text-sm font-medium mb-1 block capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input type="password" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required minLength={6} className="input-field" />
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Updating...' : 'Update Password'}</button>
      </form>
    </div>
  );
};

export default ChangePassword;
