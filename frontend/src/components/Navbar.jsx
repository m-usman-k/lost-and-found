import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search, Menu, X, LogOut, User, Package, PlusCircle,
  BarChart2, ShieldCheck, Sun, Moon, FileText,
} from 'lucide-react';

function useDarkMode() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggle = () => {
    document.documentElement.classList.toggle('dark');
    setDark((d) => !d);
  };
  return [dark, toggle];
}

const linkCls = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-accent text-accent-foreground'
      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
  }`;

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, toggleDark] = useDarkMode();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = user
    ? [
        { to: '/', label: 'Browse', icon: <Search size={15} /> },
        { to: '/report', label: 'Report Item', icon: <PlusCircle size={15} /> },
        { to: '/my-items', label: 'My Items', icon: <Package size={15} /> },
        { to: '/my-claims', label: 'My Claims', icon: <FileText size={15} /> },
        ...(isAdmin
          ? [
              { to: '/admin/claims', label: 'Claims', icon: <ShieldCheck size={15} /> },
              { to: '/admin/stats', label: 'Stats', icon: <BarChart2 size={15} /> },
            ]
          : []),
      ]
    : [{ to: '/', label: 'Browse Items', icon: <Search size={15} /> }];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-sidebar/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground shrink-0">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              L&F
            </span>
            <span className="hidden sm:block">Lost &amp; Found</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkCls}>
                {l.icon}
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="hover-elevate rounded-lg p-2 text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/profile" className={linkCls}>
                  <User size={15} />
                  {user.name.split(' ')[0]}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="hover-elevate px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground border border-primary-border transition-colors">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-sidebar px-4 py-3 space-y-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={linkCls}
              onClick={() => setMenuOpen(false)}
            >
              {l.icon}
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <NavLink to="/profile" className={linkCls} onClick={() => setMenuOpen(false)}>
                <User size={15} />
                Profile
              </NavLink>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" className="flex-1 text-center px-3 py-1.5 rounded-lg text-sm font-medium border border-border hover:bg-accent/60 transition-colors" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="flex-1 text-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground transition-colors" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
