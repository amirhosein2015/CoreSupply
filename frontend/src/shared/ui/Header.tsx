// src/shared/ui/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../infrastructure/auth/AuthContext';
import { useBasket } from '../../infrastructure/context/BasketContext';

interface HeaderProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ drawerWidth, onDrawerToggle }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useBasket(); 
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: 'rgba(10, 25, 47, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
        boxShadow: 'none',
        zIndex: (theme) => theme.zIndex.drawer + 1, // بالاتر از سایدبار
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* دکمه منو - فقط در موبایل (md به پایین) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: 'primary.main' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 1, fontSize: '0.85rem' }}>
            TERMINAL_ID / {user?.username?.split('@')[0].toUpperCase() || 'GUEST'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={() => navigate('/basket')}>
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCartIcon fontSize="small" />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={logout} size="small">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
