import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import Login from './components/pages/Login/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Billing } from './pages/Billing';
import { Quotation } from './pages/Quotation';
import { Users } from './pages/Users';
import { Staff } from './pages/Staff';
import { Analytics } from './pages/Analytics';
import { Expense } from './pages/Expense';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Profile } from './pages/Profile';

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

// Forgot Password route
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPassword,
});

// Reset Password route
const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPassword,
});

// Dashboard layout route (no path, just a wrapper)
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard-layout',
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

// Dashboard routes
const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard',
  component: Dashboard,
});

const inventoryRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/inventory',
  component: Inventory,
});

const billingRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/billing',
  component: Billing,
});

const quotationRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/quotation',
  component: Quotation,
});

const usersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/users',
  component: () => (
    <ProtectedRoute requireRole="ADMIN">
      <Users />
    </ProtectedRoute>
  ),
});

const staffRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/staff',
  component: () => (
    <ProtectedRoute requireRole="ADMIN">
      <Staff />
    </ProtectedRoute>
  ),
});

const analyticsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/analytics',
  component: () => (
    <ProtectedRoute requireRole="ADMIN">
      <Analytics />
    </ProtectedRoute>
  ),
});

const expenseRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/expense',
  component: Expense,
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/profile',
  component: Profile,
});

// Index redirect
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' });
  },
});

// Create route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  indexRoute,
  dashboardLayoutRoute.addChildren([
    dashboardRoute,
    inventoryRoute,
    billingRoute,
    quotationRoute,
    usersRoute,
    staffRoute,
    analyticsRoute,
    expenseRoute,
    profileRoute,
  ]),
]);

// Create router
export const router = createRouter({ routeTree });

// Register router types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
