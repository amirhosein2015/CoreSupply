import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import LandingPage from '../../App'; 
import DashboardPage from '../dashboard/DashboardPage'; // [New] ایمپورت داشبورد

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
  }
]);
