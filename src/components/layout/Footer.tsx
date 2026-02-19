import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  ArrowUpRight,
  MapPin,
  Phone,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const footerLinks = {
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Our Team', href: '#team' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
  ],
  services: [
    { name: 'Web Development', href: '#services' },
    { name: 'Mobile Apps', href: '#services' },
    { name: 'UI/UX Design', href: '#services' },
    { name: 'Digital Marketing', href: '#services' },
  ],
  support: [
    { name: 'Contact Us', href: '#contact' },
    { name: 'FAQs', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export const Footer = () => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email: email.trim().toLowerCase() }]);

      if (insertError) {
        if (insertError.code === '23505') {
          toast.custom(
            () => (
              <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    Already Subscribed
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    This email is already subscribed to our newsletter.
                  </p>
                </div>
              </div>
            ),
            { duration: 5000, position: 'bottom-right' },
          );
        } else {
          throw insertError;
        }
      } else {
        toast.custom(
          () => (
            <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-foreground">
                  Subscribed Successfully!
                </h4>
                <p className="text-sm text-muted-foreground">
                  Thank you for subscribing to our newsletter.
                </p>
              </div>
            </div>
          ),
          { duration: 5000, position: 'bottom-right' },
        );
        setEmail('');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      toast.custom(
        () => (
          <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-foreground">
                Subscription Failed
              </h4>
              <p className="text-sm text-muted-foreground">
                Failed to subscribe. Please try again later.
              </p>
            </div>
          </div>
        ),
        { duration: 5000, position: 'bottom-right' },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-navy border-t border-slate-grey">
      <div className="container-custom section-padding pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center mb-3">
              <img
                src="/white_logo.png"
                alt="Company Logo"
                className="w-26 h-24 object-contain"
              />
            </a>
            <p className="text-off-white leading-relaxed mb-6 max-w-sm">
              We help businesses imagine and create the digital experiences of
              tomorrow. Nepal's leading technology solutions provider.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-off-white">
                <MapPin className="w-4 h-4 text-off-white" />
                Gopikrishna, Kathmandu, Nepal
              </div>
              <div className="flex items-center gap-3 text-sm text-off-white">
                <Phone className="w-4 h-4 text-off-white" />
                +977 9000000000
              </div>
              <div className="flex items-center gap-3 text-sm text-off-white">
                <Mail className="w-4 h-4 text-off-white" />
                hello@medhatech.com
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-semibold font-display mb-4 text-off-white">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-off-white hover:text-ice-blue transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            {!isAuthenticated && (
              <Link
                to="/admin/login"
                className="text-off-white hover:text-ice-blue transition-colors text-sm block mt-3"
              >
                Admin Login
              </Link>
            )}
          </div>

          <div>
            <h4 className="font-semibold font-display mb-4 text-off-white">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-off-white hover:text-ice-blue transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-display mb-4 text-off-white">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-off-white hover:text-ice-blue transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="p-6 bg-off-white rounded-2xl border border-slate-grey mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold font-display text-lg mb-1 text-navy">
                Subscribe to our newsletter
              </h4>
              <p className="text-sm text-off-white">
                Get the latest tips for digital growth and marketing straight to
                your inbox.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex gap-3 flex-1 max-w-md"
            >
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-2 bg-off-white border border-slate-grey rounded-lg focus:outline-none focus:border-navy transition-colors text-sm text-navy placeholder:text-slate-grey"
                  disabled={isLoading}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 md:px-6 md:py-2 bg-navy text-off-white font-semibold rounded-lg hover:bg-slate-grey transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Subscribing...</span>
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-grey">
          <p className="text-sm text-off-white">
            © {new Date().getFullYear()} Medha Tech. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-lg bg-off-white flex items-center justify-center text-navy hover:bg-ice-blue hover:text-off-white transition-colors border border-slate-grey"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
