import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const themes = ['light'];

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    setTheme(theme);
  }, []);

  const setTheme = (theme: string) => {
    document.documentElement.classList.remove('light', 'dark', 'premium');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
    setCurrentTheme(theme);
  };

  const toggleTheme = () => {
    // Only one theme, so no toggle
  };

  const getIcon = () => {
    return <Sun className="h-4 w-4" />;
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
