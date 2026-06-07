import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Register | Luxora</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 md:p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="font-display text-3xl font-bold">Lux<span className="text-gold-500">ora</span></Link>
            <p className="text-zinc-500 mt-2">Create your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name', label: 'Full Name', type: 'text' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'password', label: 'Password', type: 'password' },
              { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="text-sm font-medium mb-1 block">{label}</label>
                <input type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required className="input-field" />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create Account'}</button>
          </form>
          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account? <Link to="/login" className="text-gold-500 hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
