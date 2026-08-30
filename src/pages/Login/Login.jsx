import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/playground';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const { email, password } = formData;

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-cc-bg px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-cc-border bg-cc-panel p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cc-accent/15 font-mono text-xl font-bold text-cc-accent border border-cc-accent/30">
            &lt;/&gt;
          </div>
          <h1 className="mt-4 text-2xl font-black text-cc-text">Welcome Back</h1>
          <p className="mt-1.5 text-xs text-cc-muted">
            Log in to access your projects and coding playground.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs font-semibold text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cc-muted mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cc-muted" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-cc-border bg-cc-panel2 py-2.5 pl-10 pr-4 text-sm text-cc-text placeholder:text-cc-muted/60 outline-none focus:border-cc-accent focus:ring-1 focus:ring-cc-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cc-muted mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cc-muted" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-cc-border bg-cc-panel2 py-2.5 pl-10 pr-4 text-sm text-cc-text placeholder:text-cc-muted/60 outline-none focus:border-cc-accent focus:ring-1 focus:ring-cc-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cc-accent py-3 text-sm font-bold text-black shadow-lg shadow-cc-accent/20 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
          >
            <span>{submitting ? 'Logging in...' : 'Log In'}</span>
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-cc-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-cc-accent hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
