import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Code2, FolderGit2, Trophy, BookOpen, Menu, X, Home, LogIn, UserPlus, LogOut, User, Moon, Sun } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/playground', label: 'Playground', icon: Code2 },
  { to: '/projects', label: 'My Projects', icon: FolderGit2 },
  { to: '/challenges', label: 'Challenges', icon: Trophy },
  { to: '/learn', label: 'Learn', icon: BookOpen },
];

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none ${
          isActive
            ? 'bg-cc-accent/15 text-cc-accent border border-cc-accent/30 shadow-sm'
            : 'text-cc-muted hover:bg-cc-panel2 hover:text-cc-text'
        }`
      }
      end={to === '/'}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-cc-border bg-cc-bg/95 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4" aria-label="Main navigation">
        <NavLink to="/" className="flex items-center gap-2.5 text-cc-text rounded-md focus-visible:outline-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cc-accent to-emerald-400 p-0.5 shadow-md shadow-cc-accent/10">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-cc-bg font-mono text-sm font-bold text-cc-accent">
              &lt;/&gt;
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-cc-text">
            Code <span className="text-cc-accent">Cracker</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-1.5 md:flex">
          {LINKS.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </div>

        {/* Right Auth Section */}
        <div className="hidden items-center gap-2.5 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-cc-border bg-cc-panel text-cc-muted transition hover:bg-cc-panel2 hover:text-cc-text"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-cc-border pl-3">
              <NavLink to="/profile" title="Open profile" className="flex items-center gap-2 rounded-lg border border-cc-border bg-cc-panel2 px-3 py-1.5 transition hover:border-cc-accent/40 hover:bg-cc-panel">
                <User className="h-3.5 w-3.5 text-cc-accent" />
                <span className="text-xs font-bold text-cc-text">{user?.name}</span>
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                className="flex items-center gap-1.5 rounded-lg border border-cc-border bg-cc-panel px-3 py-1.5 text-xs font-semibold text-cc-muted hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="flex items-center gap-1.5 rounded-lg border border-cc-border bg-cc-panel px-3.5 py-1.5 text-xs font-semibold text-cc-text hover:bg-cc-panel2 transition"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                className="flex items-center gap-1.5 rounded-lg bg-cc-accent px-3.5 py-1.5 text-xs font-bold text-black shadow-sm shadow-cc-accent/20 hover:brightness-110 transition"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register</span>
              </NavLink>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-cc-text hover:bg-cc-panel2 md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-cc-border bg-cc-panel p-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <NavItem key={link.to} {...link} onClick={() => setMobileOpen(false)} />
            ))}
            <button type="button" onClick={toggleTheme} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-cc-muted hover:bg-cc-panel2 hover:text-cc-text">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <div className="mt-2 border-t border-cc-border pt-3">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="text-xs font-bold text-cc-text">Signed in as {user?.name}</NavLink>
                  <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="flex items-center gap-1 rounded bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">
                    <LogOut className="h-3 w-3" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <NavLink to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-lg border border-cc-border bg-cc-panel2 py-2 text-xs font-semibold text-cc-text">Login</NavLink>
                  <NavLink to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-lg bg-cc-accent py-2 text-xs font-bold text-black">Register</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
