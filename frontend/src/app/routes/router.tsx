// src/app/routes/router.tsx

import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import LandingPage from '../../App'; 
import DashboardPage from '../dashboard/DashboardPage';
import MainLayout from '../../shared/ui/MainLayout';
import ProductListPage from '../pages/catalog/ProductListPage';

// ✅ ایمپورت صفحه جدید سبد خرید
import BasketPage from '../pages/basket/BasketPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/catalog',
        element: <ProductListPage />,
      },
      // ✅ مسیر جدید برای سبد خرید
      {
        path: '/basket',
        element: <BasketPage />,
      },
      {
        path: '/orders',
        element: <div style={{ padding: 20 }}>🚧 Orders Page (Coming Soon)</div>,
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
