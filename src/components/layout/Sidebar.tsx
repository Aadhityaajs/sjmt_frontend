import { Link, useLocation } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Package,
  Receipt,
  FileText,
  Users,
  UserCog,
  BarChart3,
  Wallet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  name: string;
  path: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Billing', path: '/billing', icon: Receipt },
  { name: 'Quotation', path: '/quotation', icon: FileText },
  { name: 'Users', path: '/users', icon: Users, adminOnly: true },
  { name: 'Staff', path: '/staff', icon: UserCog, adminOnly: true },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, adminOnly: true },
  { name: 'Expense', path: '/expense', icon: Wallet },
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const { pathname } = useLocation();
  const { hasRole } = useAuth();

  const filteredItems = menuItems.filter(item => !item.adminOnly || hasRole('ADMIN'));

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col z-40`}>
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        {!isCollapsed && <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">SJMT</span>}
        <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation - Fixed, no scroll */}
      <nav className="flex-1 py-4 px-2 overflow-hidden">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
