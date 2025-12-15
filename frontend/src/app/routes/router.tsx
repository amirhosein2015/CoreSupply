import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import LandingPage from '../../App'; 
import DashboardPage from '../dashboard/DashboardPage'; // [New] ایمپورت داشبورد
// 👇 1. ایمپورت صفحه جدید
import ProductListPage from '../pages/ProductListPage';


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
    path: '/dashboard', // [New] مسیر جدید
    element: <DashboardPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },


  // 👇 2. تعریف مسیر کاتالوگ
  {
    path: '/catalog',
    element: <ProductListPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }

]);
