import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Box, Button, TextField, Typography, 
  Paper, InputAdornment, Theme, Alert 
} from '@mui/material';
import { useAuth } from '../../infrastructure/auth/AuthContext';
import { authService } from '../../domain/services/authService';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email'; // آیکون جدید
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import FactoryIcon from '@mui/icons-material/Factory';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // 1. فراخوانی API با مدل صحیح (Email)
      const response = await authService.login({
        email: data.email, // [FIX] ارسال ایمیل به جای یوزرنیم
        password: data.password
      });

      // 2. ذخیره توکن
      login(data.email, response.accessToken); // یا response.token

      // 3. هدایت به داشبورد
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error.response?.status === 401) {
        setLoginError("Invalid email or password.");
      } else {
        setLoginError("Server unavailable. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* سمت چپ */}
      <Box
        sx={{
          flex: { xs: 0, md: 7 },
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

      {/* سمت راست: فرم */}
      <Box 
        component={Paper} 
        elevation={6} 
        square 
        sx={{ 
          flex: { xs: 12, md: 5 },
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

          {loginError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="email" // [FIX] تغییر به email
              label="Email Address" // [FIX] لیبل صحیح
              autoFocus
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
              }}
              {...register('email', { // [FIX] تغییر نام فیلد در فرم
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message as string}
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
              disabled={isLoading}
              sx={{ mt: 4, mb: 2, py: 1.8, fontSize: '1rem' }}
            >
              {isLoading ? 'Signing in...' : 'Secure Login'}
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
