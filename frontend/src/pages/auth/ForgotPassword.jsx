import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password | Luxora</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="glass-card p-8 md:p-10 w-full max-w-md text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Forgot Password</h1>
          {sent ? (
            <p className="text-zinc-500">Check your email for reset instructions.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="input-field" />
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>
          )}
          <Link to="/login" className="text-sm text-gold-500 hover:underline mt-6 inline-block">Back to Login</Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
