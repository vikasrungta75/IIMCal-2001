'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut, User, Bell, Plane, LayoutDashboard, Home, Users } from 'lucide-react';

interface NavUser {
  username: string;
  fullName: string;
  isAdmin: boolean;
}

export default function Navbar({ user }: { user?: NavUser | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const navLinks = user ? [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '/travel', label: 'Travel & Stay', icon: Plane },
    { href: '/announcements', label: 'Announcements', icon: Bell },
    { href: '/alumni', label: 'Directory', icon: Users },
    ...(user.isAdmin ? [{ href: '/admin', label: 'Admin', icon: LayoutDashboard }] : []),
  ] : [];

  return (
    <nav className={`iimc-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-xl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-3">
            <img
              src="https://www.iimcal.ac.in/sites/default/files/white-logo.png"
              alt="IIM Calcutta"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="hidden sm:block">
              <div className="text-white font-display font-bold text-base leading-tight">IIM Calcutta</div>
              <div style={{ color: '#C8A951' }} className="text-xs font-medium tracking-wider">SILVER JUBILEE 2025</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === href
                      ? 'text-white bg-white/15'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #C8A951, #8a6b1a)' }}>
                    {user.fullName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-blue-100 text-sm hidden md:block">{user.fullName?.split(' ')[0] || user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-blue-100 hover:text-white hover:bg-white/10 transition-all"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link href="/register" className="gold-btn px-4 py-2 rounded-md text-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-md"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && open && (
          <div className="lg:hidden border-t border-white/10 py-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                  pathname === href ? 'text-yellow-300' : 'text-blue-100 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-3 text-sm text-red-300 hover:text-red-200 w-full"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
