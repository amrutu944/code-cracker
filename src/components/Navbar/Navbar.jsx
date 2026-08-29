import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Code2, FolderGit2, Trophy, BookOpen, Menu, X, Home } from 'lucide-react';

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-cc-border bg-cc-bg/95 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4" aria-label="Main navigation">
        <NavLink to="/" className="flex items-center gap-2.5 text-cc-text rounded-md focus-visible:outline-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cc-accent to-emerald-400 p-0.5 shadow-md shadow-cc-accent/10">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-cc-bg font-mono text-sm font-bold text-cc-accent">
              &lt;/&gt;
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Code <span className="text-cc-accent">Cracker</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-1.5 md:flex">
          {LINKS.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
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
          </div>
        </div>
      )}
    </header>
  );
}
