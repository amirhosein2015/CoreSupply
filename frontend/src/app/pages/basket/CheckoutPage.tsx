// src/app/pages/basket/CheckoutPage.tsx

import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Stepper, Step, StepLabel, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../../../infrastructure/context/BasketContext';
import { useAuth } from '../../../infrastructure/auth/AuthContext';
import { basketService } from '../../../domain/services/basketService';
import { BasketCheckout } from '../../../domain/models/Order';
import { useToast } from '../../../infrastructure/context/ToastContext';

export default function CheckoutPage() {
  const { basket, totalPrice } = useBasket(); 
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ریدایرکت اگر سبد خالی باشد
  if (!basket || basket.items.length === 0) {
    // بهتر است از useEffect استفاده کنیم ولی برای سادگی اینجا چک می‌کنیم
    // در یک پروژه واقعی باید بهتر هندل شود
    setTimeout(() => navigate('/catalog'), 0);
    return null;
  }

  const { register, handleSubmit, formState: { errors } } = useForm<BasketCheckout>({
    defaultValues: {
      userName: user?.username || '',
      totalPrice: totalPrice,
      firstName: '',
      lastName: '',
      emailAddress: 'user@example.com',
      addressLine: 'Tehran, Valiasr St',
      country: 'Iran',
      state: 'Tehran',
      zipCode: '1234567890',
      cardName: 'Test User',
      cardNumber: '1234567890123456',
      expiration: '12/25',
      cvv: '123',
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

      console.log("🚀 Starting Checkout Saga...", checkoutPayload);

      await basketService.checkout(checkoutPayload);

      showToast("Order submitted successfully! Saga started...", "success");
      
      // هدایت به صفحه سفارش‌ها (که هنوز نساختیم)
      navigate('/orders'); 

    } catch (error) {
      console.error("Checkout failed", error);
      showToast("Checkout failed. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main" sx={{ mb: 4 }}>
        Checkout
      </Typography>
      
      <Stepper activeStep={0} sx={{ mb: 5 }}>
        <Step key="Shipping"><StepLabel>Shipping Address</StepLabel></Step>
        <Step key="Payment"><StepLabel>Payment Details</StepLabel></Step>
        <Step key="Review"><StepLabel>Review Order</StepLabel></Step>
      </Stepper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            
            {/* بخش آدرس */}
            <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
              Shipping Address
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="First Name" fullWidth required {...register("firstName")} />
              <TextField label="Last Name" fullWidth required {...register("lastName")} />
            </Stack>

            <TextField label="Email Address" fullWidth required {...register("emailAddress")} />
            <TextField label="Address Line" fullWidth required {...register("addressLine")} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Country" fullWidth required {...register("country")} />
              <TextField label="Zip Code" fullWidth required {...register("zipCode")} />
            </Stack>

            {/* بخش پرداخت */}
            <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mt: 2 }}>
              Payment Method (Demo)
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Card Name" fullWidth required {...register("cardName")} />
              <TextField label="Card Number" fullWidth required {...register("cardNumber")} />
            </Stack>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
               <TextField label="Expiration" fullWidth required {...register("expiration")} />
               <TextField label="CVV" fullWidth required {...register("cvv")} />
            </Stack>

            {/* بخش دکمه و قیمت */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed grey', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
               <Typography variant="h4" color="primary.main" fontWeight="bold" sx={{ mb: 2 }}>
                  Total: ${totalPrice}
               </Typography>

               <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                disabled={isSubmitting}
                sx={{ minWidth: 200, py: 1.5, fontSize: '1.1rem' }}
               >
                 {isSubmitting ? 'Processing...' : 'Place Order'}
               </Button>
            </Box>

          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
