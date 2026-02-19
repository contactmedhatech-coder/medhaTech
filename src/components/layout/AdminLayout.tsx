import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/supabase-functions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/jobs', label: 'Job Management', icon: Briefcase },
  { href: '/admin/blogs', label: 'Blog Management', icon: FileText },
  { href: '/admin/applications', label: 'Applications', icon: Users },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#001F4D] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-lg border-slate-200 hover:bg-slate-50"
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#001F4D] to-[#001a40] shadow-2xl transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Shield className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white font-display">
                  Admin Panel
                </h1>
                <p className="text-xs text-blue-300">Medha Tech Solutions</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/admin' &&
                  location.pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start transition-all duration-200',
                    isActive
                      ? 'bg-white/15 text-white hover:bg-white/20 shadow-lg'
                      : 'text-blue-200 hover:text-white hover:bg-white/10',
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <Icon
                    className={cn(
                      'mr-3 h-4 w-4',
                      isActive ? 'text-amber-400' : '',
                    )}
                  />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Button
              variant="outline"
              className="w-full justify-start text-blue-200 hover:text-white hover:bg-white/10 border-white/10"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          'transition-all duration-200',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0',
        )}
      >
        <div className="lg:hidden p-4">{/* Spacer for mobile toggle */}</div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
