import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Code2, FolderGit2, LogOut, Moon, Sun, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const initials = (user?.name || 'U').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cc-accent">Account</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-cc-text">Your profile</h1>
      <p className="mt-2 text-sm text-cc-muted">Manage your account and workspace preferences.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-cc border border-cc-border bg-cc-panel p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cc-accent/15 text-lg font-bold text-cc-accent">{initials}</div>
            <div><h2 className="text-lg font-bold text-cc-text">{user?.name || 'Code Cracker user'}</h2><p className="mt-1 text-sm text-cc-muted">{user?.email || 'No email address available'}</p></div>
          </div>
          <dl className="mt-7 divide-y divide-cc-border border-y border-cc-border text-sm">
            <div className="flex justify-between gap-4 py-3"><dt className="text-cc-muted">Display name</dt><dd className="font-medium text-cc-text">{user?.name || '—'}</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-cc-muted">Email</dt><dd className="font-medium text-cc-text">{user?.email || '—'}</dd></div>
          </dl>
          <button type="button" onClick={handleLogout} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-red-400/40 px-3.5 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"><LogOut className="h-4 w-4" /> Log out</button>
        </section>

        <div className="space-y-5">
          <section className="rounded-cc border border-cc-border bg-cc-panel p-5">
            <div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold text-cc-text">Appearance</h2><p className="mt-1 text-sm text-cc-muted">{theme === 'dark' ? 'Dark mode is active.' : 'Light mode is active.'}</p></div><button type="button" role="switch" aria-checked={theme === 'dark'} onClick={toggleTheme} className="flex h-10 w-16 items-center rounded-full bg-cc-panel2 p-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cc-accent"><span className={`flex h-8 w-8 items-center justify-center rounded-full bg-cc-accent text-slate-950 transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>{theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</span></button></div>
          </section>
          <section className="rounded-cc border border-cc-border bg-cc-panel p-5"><h2 className="font-semibold text-cc-text">Quick navigation</h2><div className="mt-4 grid gap-2"><Link to="/playground" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cc-text hover:bg-cc-panel2"><Code2 className="h-4 w-4 text-cc-accent" />Open Playground</Link><Link to="/projects" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cc-text hover:bg-cc-panel2"><FolderGit2 className="h-4 w-4 text-cc-accent" />My Projects</Link><Link to="/learn" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cc-text hover:bg-cc-panel2"><BookOpen className="h-4 w-4 text-cc-accent" />Learning paths</Link></div></section>
        </div>
      </div>
    </div>
  );
}
