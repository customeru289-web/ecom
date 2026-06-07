import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Reset Password | Luxora</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="glass-card p-8 md:p-10 w-full max-w-md">
          <h1 className="font-display text-2xl font-bold text-center mb-6">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required minLength={6} className="input-field" />
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
          <Link to="/login" className="text-sm text-gold-500 hover:underline mt-4 block text-center">Back to Login</Link>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
