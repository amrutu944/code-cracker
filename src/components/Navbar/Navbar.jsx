import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/playground', label: 'Playground' },
  { to: '/projects', label: 'My Projects' },
  { to: '/challenges', label: 'Challenges' },
  { to: '/learn', label: 'Learn' },
];

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cc-accent2 ${
          isActive ? 'bg-cc-panel2 text-cc-text' : 'text-cc-muted hover:bg-cc-panel2 hover:text-cc-text'
        }`
      }
      end={to === '/'}
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-cc-border bg-cc-bg/95 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4" aria-label="Main navigation">
        <NavLink to="/" className="flex items-center gap-2 text-cc-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cc-accent2 rounded-md">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-cc bg-cc-accent/15 font-mono text-sm font-bold text-cc-accent"
            aria-hidden="true"
          >
            {'<>'}
          </span>
          <span className="text-base font-semibold tracking-tight">Code Cracker</span>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-cc-text md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-cc-border bg-cc-bg md:hidden">
          <div className="flex flex-col gap-1 p-3">
            {LINKS.map((link) => (
              <NavItem key={link.to} {...link} onClick={() => setMobileOpen(false)} />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
