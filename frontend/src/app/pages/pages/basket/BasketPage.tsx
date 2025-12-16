// src/app/pages/basket/BasketPage.tsx

import React from 'react';
import { 
  Box, Typography, Paper, Button, IconButton, Divider, List, ListItem, 
  ListItemText, ListItemAvatar, Avatar, Stack 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../../../../infrastructure/context/BasketContext';



export default function BasketPage() {
  const { basket, removeFromBasket, totalPrice } = useBasket();
  const navigate = useNavigate();

  // حالت سبد خالی
  if (!basket || basket.items.length === 0) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Looks like you haven't added anything to your cart yet.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/catalog')}>
          Go to Catalog
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Shopping Cart
      </Typography>

      {/* چیدمان اصلی: در دسکتاپ افقی، در موبایل عمودی */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        
        {/* بخش سمت چپ: لیست آیتم‌ها (70% فضا) */}
        <Box sx={{ flex: 2 }}>
          <Paper elevation={2} sx={{ overflow: 'hidden' }}>
            <List sx={{ p: 0 }}>
              {basket.items.map((item, index) => (
                <React.Fragment key={item.productId}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        color="error" 
                        onClick={() => removeFromBasket(item.productId)}
                        title="Remove Item"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{ p: 3 }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.light', fontSize: '1.5rem' }}
                      >
                        {item.productName.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                          {item.productName}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            Unit Price: <b>${item.price}</b>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: <b>{item.quantity}</b>
                          </Typography>
                        </Stack>
                      }
                    />
                    
                    {/* قیمت کل آیتم (سمت راست لیست) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', mr: 2 }}>
                       <Typography variant="h6" fontWeight="bold" color="primary.main">
                        ${item.price * item.quantity}
                      </Typography>
                    </Box>
                  </ListItem>
                  
                  {/* خط جداکننده بین آیتم‌ها */}
                  {index < basket.items.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>

        {/* بخش سمت راست: خلاصه فاکتور (30% فضا) */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="bold">${totalPrice}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Tax (VAT 0%)</Typography>
                <Typography fontWeight="bold">$0</Typography>
              </Box>
            </Stack>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">Total</Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                ${totalPrice}
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              onClick={() => alert('Proceed to Checkout (Order Saga) - Coming Next!')}
              sx={{ py: 1.5, mb: 2, fontWeight: 'bold' }}
            >
              Checkout Now
            </Button>
            
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/catalog')}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Box>

      </Stack>
    </Box>
  );
}
