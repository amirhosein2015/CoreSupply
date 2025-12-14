import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
// فرض می‌کنیم App.tsx در ریشه src است
import LandingPage from '../../App'; 

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
    path: '*', // ریدایرکت برای آدرس‌های اشتباه
    element: <Navigate to="/" replace />,
  }
]);
