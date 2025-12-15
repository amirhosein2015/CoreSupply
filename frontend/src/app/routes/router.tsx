import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import LandingPage from '../../App'; 
import DashboardPage from '../dashboard/DashboardPage';
import ProductListPage from '../pages/ProductListPage';
import MainLayout from '../../shared/ui/MainLayout'; // ایمپورت Layout

export const router = createBrowserRouter([
  // مسیرهای عمومی (بدون Layout)
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },

  // مسیرهای داخلی (با Layout و Sidebar)
  {
    element: <MainLayout />, // این کامپوننت مادر است
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/catalog',
        element: <ProductListPage />,
      },
      {
        path: '/orders',
        element: <div>🚧 Orders Page (Coming Soon)</div>,
      }
    ]
  },

  // مسیر پیش‌فرض (ریدایرکت)
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
