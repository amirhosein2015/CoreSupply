import { useForm } from 'react-hook-form';
import { 
  Box, Button, TextField, Typography, 
  Paper, InputAdornment, Theme 
} from '@mui/material';
import { useAuth } from '../../infrastructure/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import FactoryIcon from '@mui/icons-material/Factory';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    login(data.username, 'mock-token');
    navigate('/dashboard');
  };

  return (
    // کانتینر اصلی (Flexbox) به جای Grid
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* سمت چپ: تصویر صنعتی (60% عرض در دسکتاپ) */}
      <Box
        sx={{
          flex: { xs: 0, md: 7 }, // در موبایل مخفی، در دسکتاپ 7 واحد
          backgroundImage: 'url(https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t: Theme) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to right, rgba(0,47,93,0.8), rgba(0,47,93,0.4))',
          display: 'flex', alignItems: 'flex-end', p: 6
        }}>
          <Box sx={{ color: 'white' }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              CoreSupply
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Advanced Supply Chain Orchestration Platform
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* سمت راست: فرم (40% عرض در دسکتاپ، 100% در موبایل) */}
      <Box 
        component={Paper} 
        elevation={6} 
        square 
        sx={{ 
          flex: { xs: 12, md: 5 }, // تمام عرض در موبایل، 5 واحد در دسکتاپ
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', width: '100%' }}>
          
          <Box sx={{ mb: 4, p: 2, bgcolor: 'background.default', borderRadius: '50%' }}>
            <FactoryIcon color="primary" sx={{ fontSize: 40 }} />
          </Box>
          
          <Typography component="h1" variant="h4" fontWeight="700" color="primary" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please sign in to access the dashboard.
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Username / Corporate ID"
              autoFocus
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonOutlineIcon color="action" /></InputAdornment>,
              }}
              {...register('username', { required: 'ID is required' })}
              error={!!errors.username}
              helperText={errors.username?.message as string}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              id="password"
              InputProps={{
                startAdornment: <InputAdornment position="start"><HttpsOutlinedIcon color="action" /></InputAdornment>,
              }}
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message as string}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, py: 1.8, fontSize: '1rem' }}
            >
              Secure Login
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Protected by CoreSupply Identity Service (OIDC)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
