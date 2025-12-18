// src/shared/ui/MainLayout.tsx

import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DRAWER_WIDTH = 280;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* هدر سایت */}
      <Header drawerWidth={DRAWER_WIDTH} onDrawerToggle={handleDrawerToggle} />
      
      {/* سایدبار */}
      <Sidebar 
        drawerWidth={DRAWER_WIDTH} 
        mobileOpen={mobileOpen} 
        onClose={handleDrawerToggle} 
      />
      
      {/* 
          بخش محتوای اصلی - اصلاح شده:
          ۱. در دسکتاپ (md به بالا) به اندازه DRAWER_WIDTH حاشیه می‌گیرد تا زیر سایدبار نرود.
          ۲. عرض آن دقیق محاسبه می‌شود تا اسکرول افقی ایجاد نشود.
      */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          // ✅ ایجاد فاصله از سمت چپ فقط در دسکتاپ
          ml: { md: `${DRAWER_WIDTH}px` }, 
          // ✅ محاسبه دقیق عرض برای جلوگیری از بیرون زدن محتوا
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden', // جلوگیری از اسکرول افقی
        }}
      >
        <Toolbar /> {/* ایجاد فاصله از هدر که fixed است */}
        
        {/* کانتینر داخلی برای وسط‌چین کردن و محدود کردن عرض در مانیتورهای بزرگ */}
        <Box sx={{ 
          flexGrow: 1, 
          width: '100%', 
          maxWidth: '1500px', 
          mx: 'auto' 
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
