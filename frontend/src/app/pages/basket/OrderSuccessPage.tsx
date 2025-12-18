// src/app/pages/basket/OrderSuccessPage.tsx

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center', maxWidth: 600 }}>
        <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
        
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Order Placed Successfully!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your purchase. Your order has been received and is being processed by our distributed system (Saga Pattern).
        </Typography>

        <Button 
          variant="contained" 
          size="large" 
          onClick={() => navigate('/catalog')}
        >
          Back to Catalog
        </Button>
      </Paper>
    </Box>
  );
}
