import { 
  Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Box, Divider, Typography, Stack 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HubIcon from '@mui/icons-material/Hub';
import MemoryIcon from '@mui/icons-material/Memory';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const menuItems = [
  { text: 'SYSTEM_TERMINAL', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'COMPONENT_REGISTRY', icon: <MemoryIcon />, path: '/catalog' },
  { text: 'SAGA_LEDGER', icon: <HubIcon />, path: '/orders' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box', 
          backgroundColor: '#020617', 
          color: '#e6f1ff',
          borderRight: '2px solid #00e5ff33' 
        },
      }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 900, letterSpacing: 2 }}>
          CORE_SUPPLY
        </Typography>
        <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'bold', letterSpacing: 1 }}>
          DISTRIBUTED B2B ENGINE
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.1 }} />

      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={isSelected}
                sx={{
                  borderLeft: isSelected ? '5px solid #00e5ff' : '5px solid transparent',
                  bgcolor: isSelected ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                  '&.Mui-selected:hover': { bgcolor: 'rgba(0, 229, 255, 0.12)' },
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? 'primary.main' : '#444', minWidth: 45 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: '900', letterSpacing: 1 }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Stack sx={{ mt: 'auto', p: 3, borderTop: '1px solid #00e5ff22', bgcolor: 'rgba(0,229,255,0.02)' }} spacing={1.5}>
        <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: '900', fontSize: '1rem' }}>
          <Box sx={{ 
            width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%', 
            boxShadow: '0 0 10px #4caf50', animation: 'pulse 2s infinite' 
          }} />
          MICROSERVICES_ONLINE
        </Typography>
        <Typography variant="caption" sx={{ color: '#334155', letterSpacing: 1, fontWeight: 'bold' }}>
          NODE_STABLE_V8.0.1
        </Typography>
      </Stack>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      `}</style>
    </Drawer>
  );
}
