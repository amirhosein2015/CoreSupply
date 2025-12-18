// src/app/routes/router.tsx

import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import LandingPage from '../../App'; 
import DashboardPage from '../dashboard/DashboardPage';
import MainLayout from '../../shared/ui/MainLayout';
import ProductListPage from '../pages/catalog/ProductListPage';
import BasketPage from '../pages/basket/BasketPage';
import CheckoutPage from '../pages/basket/CheckoutPage';
import OrderSuccessPage from '../pages/basket/OrderSuccessPage';
import OrdersHistoryPage from '../pages/orders/OrdersHistoryPage';

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
      {
        path: '/basket',
        element: <BasketPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
      // ✅ مسیر جدید برای موفقیت سفارش
      {
        path: '/order-success',
        element: <OrderSuccessPage />,
      },
      {
        path: '/orders',
        element: <OrdersHistoryPage />,
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
