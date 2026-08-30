import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/playground';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-cc-bg px-4 py-12 dark:bg-cc-darkBg">
      <div className="w-full max-w-md rounded-[28px] border border-cc-border bg-cc-panel p-8 shadow-soft ring-1 ring-black/5 dark:border-cc-darkBorder dark:bg-cc-darkPanel">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cc-accent/25 bg-cc-accent/10 font-mono text-xl font-black text-cc-accent shadow-sm shadow-cc-accent/10">
            &lt;/&gt;
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-cc-text dark:text-cc-darkText">Create your account</h1>
          <p className="mt-2 text-sm text-cc-muted dark:text-cc-darkMuted">
            Join Code Cracker to write code, save projects, and take coding challenges.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs font-semibold text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-cc-muted dark:text-cc-darkMuted">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cc-muted dark:text-cc-darkMuted" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Rivers"
                className="w-full rounded-2xl border border-cc-border bg-cc-panel2 py-3 pl-11 pr-4 text-sm text-cc-text placeholder:text-cc-muted/70 outline-none transition focus:border-cc-accent focus:ring-2 focus:ring-cc-accent/20 dark:border-cc-darkBorder dark:bg-cc-darkPanel2 dark:text-cc-darkText dark:placeholder:text-cc-darkMuted/80"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-cc-muted dark:text-cc-darkMuted">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cc-muted dark:text-cc-darkMuted" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className="w-full rounded-2xl border border-cc-border bg-cc-panel2 py-3 pl-11 pr-4 text-sm text-cc-text placeholder:text-cc-muted/70 outline-none transition focus:border-cc-accent focus:ring-2 focus:ring-cc-accent/20 dark:border-cc-darkBorder dark:bg-cc-darkPanel2 dark:text-cc-darkText dark:placeholder:text-cc-darkMuted/80"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-cc-muted dark:text-cc-darkMuted">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cc-muted dark:text-cc-darkMuted" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-cc-border bg-cc-panel2 py-3 pl-11 pr-4 text-sm text-cc-text placeholder:text-cc-muted/70 outline-none transition focus:border-cc-accent focus:ring-2 focus:ring-cc-accent/20 dark:border-cc-darkBorder dark:bg-cc-darkPanel2 dark:text-cc-darkText dark:placeholder:text-cc-darkMuted/80"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-cc-muted dark:text-cc-darkMuted">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cc-muted dark:text-cc-darkMuted" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-cc-border bg-cc-panel2 py-3 pl-11 pr-4 text-sm text-cc-text placeholder:text-cc-muted/70 outline-none transition focus:border-cc-accent focus:ring-2 focus:ring-cc-accent/20 dark:border-cc-darkBorder dark:bg-cc-darkPanel2 dark:text-cc-darkText dark:placeholder:text-cc-darkMuted/80"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cc-accent py-3.5 text-sm font-bold text-black shadow-glow transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
          >
            <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-cc-muted dark:text-cc-darkMuted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-cc-accent hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
