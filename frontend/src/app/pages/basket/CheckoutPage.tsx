// src/app/pages/basket/CheckoutPage.tsx

import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Stepper, Step, StepLabel, Stack, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../../../infrastructure/context/BasketContext';
import { useAuth } from '../../../infrastructure/auth/AuthContext';
import { basketService } from '../../../domain/services/basketService';
import { BasketCheckout } from '../../../domain/models/Order';
import { useToast } from '../../../infrastructure/context/ToastContext';

export default function CheckoutPage() {
  const { basket, totalPrice, clearBasket } = useBasket(); 
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!basket || basket.items.length === 0) {
    setTimeout(() => navigate('/catalog'), 0);
    return null;
  }

  const { register, handleSubmit } = useForm<BasketCheckout>({
    defaultValues: {
      userName: user?.username || '',
      totalPrice: totalPrice,
      firstName: '',
      lastName: '',
      emailAddress: 'procurement@company.com',
      addressLine: 'Industrial Zone, Sector 4, Unit 12',
      country: 'Germany',
      state: 'Berlin',
      zipCode: '10115',
      cardName: 'Corporate Credit',
      cardNumber: 'xxxx-xxxx-xxxx-4242',
      expiration: '12/28',
      cvv: '***',
      paymentMethod: 1
    }
  });

  const onSubmit = async (data: BasketCheckout) => {
    try {
      setIsSubmitting(true);
      const checkoutPayload: BasketCheckout = { ...data, totalPrice: totalPrice, userName: user?.username || '' };
      
      await basketService.checkout(checkoutPayload);
      
      clearBasket();
      showToast("PROCUREMENT_SAGA_INITIATED", "success");
      navigate('/order-success'); 

    } catch (error) {
      showToast("TRANSACTION_FAILED", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 900, margin: '0 auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary" sx={{ mb: 1, letterSpacing: 2 }}>
        CHECKOUT / PROCUREMENT
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontFamily: 'monospace' }}>
        SYSTEM_READY_FOR_TRANSACTION
      </Typography>
      
      <Stepper activeStep={1} alternativeLabel sx={{ mb: 5 }}>
        <Step key="Review"><StepLabel>Review Items</StepLabel></Step>
        <Step key="Shipping"><StepLabel>Logistics Info</StepLabel></Step>
        <Step key="Processing"><StepLabel>Processing</StepLabel></Step>
      </Stepper>

      <Paper variant="outlined" sx={{ p: 5, borderRadius: 0, border: '1px solid rgba(0, 229, 255, 0.2)', bgcolor: 'rgba(10, 25, 47, 0.4)' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase', fontSize: '0.9rem', mb: 2, letterSpacing: 1, color: 'primary.main' }}>
                Delivery Location
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.1 }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField label="First Name" fullWidth size="small" required {...register("firstName")} />
                <TextField label="Last Name" fullWidth size="small" required {...register("lastName")} />
              </Stack>
              <TextField label="Department Email" fullWidth size="small" required sx={{ mb: 2 }} {...register("emailAddress")} />
              <TextField label="Warehouse Address" fullWidth size="small" required sx={{ mb: 2 }} {...register("addressLine")} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Country" fullWidth size="small" required {...register("country")} />
                <TextField label="Postal Code" fullWidth size="small" required {...register("zipCode")} />
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase', fontSize: '0.9rem', mb: 2, mt: 2, letterSpacing: 1, color: 'primary.main' }}>
                Billing Information
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.1 }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField label="Account Name" fullWidth size="small" required {...register("cardName")} />
                <TextField label="Account Number" fullWidth size="small" required {...register("cardNumber")} />
              </Stack>
            </Box>

            <Box sx={{ mt: 4, pt: 3, borderTop: '2px solid #00e5ff33', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Stack>
                 <Typography variant="caption" color="text.secondary">TOTAL_ESTIMATED_COST</Typography>
                 <Typography variant="h4" color="primary.main" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                    ${totalPrice.toLocaleString()}
                 </Typography>
               </Stack>
               <Button type="submit" variant="contained" color="primary" size="large" disabled={isSubmitting}
                sx={{ minWidth: 220, py: 1.5, borderRadius: 0, textTransform: 'uppercase', letterSpacing: 2 }}>
                 {isSubmitting ? 'PROCESSING...' : 'CONFIRM_PROCUREMENT'}
               </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
