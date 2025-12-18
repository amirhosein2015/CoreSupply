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
  const { basket, totalPrice, clearBasket } = useBasket(); // ✅ دریافت clearBasket
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!basket || basket.items.length === 0) {
    setTimeout(() => navigate('/catalog'), 0);
    return null;
  }

  const { register, handleSubmit, formState: { errors } } = useForm<BasketCheckout>({
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
      
      const checkoutPayload: BasketCheckout = {
        ...data,
        totalPrice: totalPrice,
        userName: user?.username || ''
      };

      console.log("🚀 Starting Procurement Saga...", checkoutPayload);
      await basketService.checkout(checkoutPayload);

      // ✅ خالی کردن سبد خرید بعد از موفقیت
      clearBasket();

      showToast("Procurement order initiated successfully.", "success");
      navigate('/order-success'); 

    } catch (error) {
      console.error("Checkout failed", error);
      showToast("Transaction failed. Please check connection.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 900, margin: '0 auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary" sx={{ mb: 1, letterSpacing: -0.5 }}>
        CHECKOUT / PROCUREMENT
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontFamily: 'monospace' }}>
        REF: ORD-{new Date().getTime().toString().slice(-6)}
      </Typography>
      
      <Stepper activeStep={1} alternativeLabel sx={{ mb: 5 }}>
        <Step key="Review"><StepLabel>Review Items</StepLabel></Step>
        <Step key="Shipping"><StepLabel>Logistics Info</StepLabel></Step>
        <Step key="Processing"><StepLabel>Processing</StepLabel></Step>
      </Stepper>

      <Paper variant="outlined" sx={{ p: 5, borderRadius: 0, border: '1px solid #ccc' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase', fontSize: '0.9rem', mb: 2, letterSpacing: 1 }}>
                Delivery Location
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField label="Contact First Name" fullWidth size="small" required {...register("firstName")} />
                <TextField label="Contact Last Name" fullWidth size="small" required {...register("lastName")} />
              </Stack>

              <TextField label="Department Email" fullWidth size="small" required sx={{ mb: 2 }} {...register("emailAddress")} />
              <TextField label="Warehouse Address" fullWidth size="small" required sx={{ mb: 2 }} {...register("addressLine")} />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Country / Region" fullWidth size="small" required {...register("country")} />
                <TextField label="Postal Code" fullWidth size="small" required {...register("zipCode")} />
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase', fontSize: '0.9rem', mb: 2, mt: 2, letterSpacing: 1 }}>
                Billing Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField label="Account Name" fullWidth size="small" required {...register("cardName")} />
                <TextField label="Account Number" fullWidth size="small" required {...register("cardNumber")} />
              </Stack>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                 <TextField label="Expiry" fullWidth size="small" required {...register("expiration")} />
                 <TextField label="Security Code" fullWidth size="small" required {...register("cvv")} />
              </Stack>
            </Box>

            <Box sx={{ mt: 4, pt: 3, borderTop: '2px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Stack>
                 <Typography variant="caption" color="text.secondary">TOTAL ESTIMATED COST</Typography>
                 <Typography variant="h4" color="text.primary" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                    ${totalPrice.toLocaleString()}
                 </Typography>
               </Stack>

               <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                disabled={isSubmitting}
                sx={{ 
                  minWidth: 220, 
                  py: 1.5, 
                  fontSize: '1rem', 
                  borderRadius: 0,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
               >
                 {isSubmitting ? 'INITIATING...' : 'CONFIRM ORDER'}
               </Button>
            </Box>

          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

