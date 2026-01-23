import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-110 z-50"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-transform duration-300" />
      ) : (
        <Sun className="h-6 w-6 text-yellow-500 transition-transform duration-300" />
      )}
    </button>
  );
}
