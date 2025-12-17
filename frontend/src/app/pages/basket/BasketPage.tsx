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

// ✅ اصلاح مسیر: ۳ پله عقب (چون پوشه اضافه پاک شد)
import { useBasket } from '../../../infrastructure/context/BasketContext';
import { BasketItem } from '../../../domain/models/Basket'; // مسیر مدل هم ۳ پله است

export default function BasketPage() {
  const { basket, removeFromBasket, totalPrice } = useBasket();
  const navigate = useNavigate();

  // 1. فیلتر کردن و تایپ‌دهی صریح
  const validItems: BasketItem[] = (basket?.items || []).filter((item: any) => {
    return item && (item.componentName || item.productName || item.name);
  }).map((item: any) => ({
    componentId: item.componentId || item.productId,
    componentName: item.componentName || item.productName || item.name,
    unitPrice: item.unitPrice || item.price || 0,
    quantity: item.quantity || 1
  }));

  if (!basket || validItems.length === 0) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Your cart is empty
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

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        
        <Box sx={{ flex: 2 }}>
          <Paper elevation={2} sx={{ overflow: 'hidden' }}>
            <List sx={{ p: 0 }}>
              {/* ✅ اصلاح تایپ ایندکس */}
              {validItems.map((item, index: number) => (
                <React.Fragment key={item.componentId || index}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        color="error" 
                        onClick={() => removeFromBasket(item.componentId)}
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
                        {(item.componentName || "U").charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                          {item.componentName}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            Unit Price: <b>${item.unitPrice}</b>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: <b>{item.quantity}</b>
                          </Typography>
                        </Stack>
                      }
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', mr: 2 }}>
                       <Typography variant="h6" fontWeight="bold" color="primary.main">
                        ${item.unitPrice * item.quantity}
                      </Typography>
                    </Box>
                  </ListItem>
                  
                  {index < validItems.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>

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
              onClick={() => navigate('/checkout')}
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
