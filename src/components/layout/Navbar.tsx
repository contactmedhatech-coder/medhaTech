import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Home111', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Blog', href: '#blogs' },
  { name: 'Team', href: '#team' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-navy backdrop-blur-xl border-b border-slate-grey/50"
    >
      <div className="container-custom">
        <nav className="flex items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="logoBadge w-24 h-24 md:w-48 md:h-48 flex items-center justify-center">
              <img
                src={'/white_logo.png'}
                alt="Company Logo"
                className="w-24 h-24 md:w-48 md:h-48 object-contain drop-shadow-md"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center w-[75%] px-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href.startsWith('/') ? link.href : `/${link.href}`}
                className="text-amber hover:text-ice-blue transition-colors duration-200 text-base font-bold px-6"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="hidden lg:block ml-4">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-off-white p-2 ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy/95 backdrop-blur-xl border-b border-slate-grey"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href.startsWith('/') ? link.href : `/${link.href}`}
                  className="text-off-white hover:text-ice-blue transition-colors py-2 text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
