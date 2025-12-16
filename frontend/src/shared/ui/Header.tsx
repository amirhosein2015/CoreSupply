// src/shared/ui/Header.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import LogoutIcon from '@mui/icons-material/Logout';

// ✅ اضافه کردن هوک مسیریابی
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../infrastructure/auth/AuthContext';
import { useBasket } from '../../infrastructure/context/BasketContext';

interface HeaderProps {
  drawerWidth: number;
}

const Header: React.FC<HeaderProps> = ({ drawerWidth }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useBasket(); 
  
  // ✅ تعریف هوک مسیریابی
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          {/* ✅ دکمه سبد خرید با قابلیت کلیک و انتقال به صفحه سبد */}
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/basket')}
          >
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight="bold">
              {user?.username}
            </Typography>
          </Box>

          <IconButton color="inherit" onClick={logout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
