import { Box, Typography, Button, Paper } from '@mui/material';
import { useAuth } from '../../infrastructure/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Dashboard
        </Typography>
        <Typography variant="h6">
          Welcome, {user?.username || 'User'}! 👋
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
          This is the secure area of CoreSupply.
        </Typography>
        
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Paper>
    </Box>
  );
}
