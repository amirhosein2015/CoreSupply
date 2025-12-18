// src/shared/ui/Sidebar.tsx
import { 
  Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Box, Divider, Typography, Stack 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HubIcon from '@mui/icons-material/Hub';
import MemoryIcon from '@mui/icons-material/Memory';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: 'SYSTEM_TERMINAL', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'COMPONENT_REGISTRY', icon: <MemoryIcon />, path: '/catalog' },
  { text: 'SAGA_LEDGER', icon: <HubIcon />, path: '/orders' },
];

export default function Sidebar({ drawerWidth, mobileOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#020617' }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 900, letterSpacing: 2 }}>CORE_SUPPLY</Typography>
        <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>B2B_SAGA_ENGINE</Typography>
      </Box>
      <Divider sx={{ opacity: 0.1 }} />
      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => { navigate(item.path); if(mobileOpen) onClose(); }}
                selected={isSelected}
                sx={{
                  borderLeft: isSelected ? '4px solid #00e5ff' : '4px solid transparent',
                  bgcolor: isSelected ? 'rgba(0, 229, 255, 0.05)' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? 'primary.main' : '#444', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.75rem', fontWeight: '900' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Stack sx={{ mt: 'auto', p: 3 }} spacing={1}>
        <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
          <Box sx={{ width: 8, height: 8, bgcolor: '#4caf50', borderRadius: '50%' }} />
          NODE_ACTIVE
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <Box component="nav">
      {/* نسخه موبایل - پاپ آپ */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* نسخه دسکتاپ - ثابت */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(0, 229, 255, 0.2)' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
