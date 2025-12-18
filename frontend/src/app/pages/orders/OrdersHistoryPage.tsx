// src/app/pages/orders/OrdersHistoryPage.tsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAuth } from '../../../infrastructure/auth/AuthContext';
import { orderService } from '../../../domain/services/orderService';
import { OrderSummary } from '../../../domain/models/Order';

// تابع کمکی برای رنگ وضعیت
const getStatusColor = (status: string) => {
  if (!status) return 'default';
  switch (status.toLowerCase()) {
    case 'submitted': return 'default';
    case 'stockconfirmed': return 'info';
    case 'paid': return 'success';
    case 'shipped': return 'success';
    case 'cancelled': return 'error';
    default: return 'warning';
  }
};

export default function OrdersHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.username) {
        try {
          const data = await orderService.getOrdersByUser(user.username);
          setOrders(data);
        } catch (error) {
          console.error("Failed to load orders", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user]);

  // تعریف ستون‌ها با تایپ ساده (any) برای جلوگیری از خطای TS
  const columns: GridColDef[] = [
    { field: 'orderId', headerName: 'Order ID', width: 150 }, 
    { 
      field: 'orderDate', 
      headerName: 'Date', 
      width: 200,
      valueFormatter: (params: any) => {
        if (!params) return '';
        return new Date(params).toLocaleString();
      }
    },
    { 
      field: 'total', 
      headerName: 'Total Amount', 
      width: 150,
      renderCell: (params: any) => <b>${params.value}</b>
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params: any) => (
        <Chip 
          label={params.value as string} 
          color={getStatusColor(params.value as string)} 
          variant="outlined" 
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
      )
    }
  ];

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      <Stack spacing={3}>
        {/* هدر صفحه */}
        <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ letterSpacing: -0.5 }}>
          LOGISTICS TRACKING
        </Typography>
        
        {/* بدنه جدول */}
        <Paper variant="outlined" sx={{ width: '100%', height: 600, borderRadius: 0 }}>
          <DataGrid
            rows={orders}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.orderId || Math.random()} 
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25]}
            sx={{ 
              border: 0,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }
            }}
          />
        </Paper>
      </Stack>
    </Box>
  );
}
