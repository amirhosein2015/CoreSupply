import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      
      {/* فضای اصلی محتوا */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
        <Toolbar /> {/* این خط برای این است که محتوا زیر هدر نرود */}
        <Outlet /> {/* اینجا جایی است که صفحات (Dashboard, Catalog) رندر می‌شوند */}
      </Box>
    </Box>
  );
}
