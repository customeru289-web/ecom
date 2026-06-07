import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      toast.success('Welcome back!');
      navigate(data.user.role === 'admin' ? '/admin' : from);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Login | Luxora</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 md:p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="font-display text-3xl font-bold">Lux<span className="text-gold-500">ora</span></Link>
            <p className="text-zinc-500 mt-2">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="input-field" />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-gold-500 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <p className="text-center text-sm text-zinc-500 mt-6">
            Don&apos;t have an account? <Link to="/register" className="text-gold-500 hover:underline">Register</Link>
          </p>
          <div className="mt-6 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500">
            <p>Demo: admin@luxora.com / admin123</p>
            <p>Demo: customer@luxora.com / customer123</p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
