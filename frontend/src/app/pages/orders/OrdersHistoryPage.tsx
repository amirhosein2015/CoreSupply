// src/app/pages/orders/OrdersHistoryPage.tsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Stack, Alert, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAuth } from '../../../infrastructure/auth/AuthContext';
import { orderService } from '../../../domain/services/orderService';
import { OrderSummary } from '../../../domain/models/Order';

const getStatusColor = (status: string) => {
  if (!status) return 'default';
  switch (status.toLowerCase()) {
    case 'pending': return 'warning';
    case 'submitted': return 'info';
    case 'paid': return 'success';
    case 'shipped': return 'success';
    case 'cancelled': return 'error';
    default: return 'primary';
  }
};

export default function OrdersHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      // لاگ برای دیباگ - حتما چک کنید در کنسول چه چاپ می‌شود
      console.log("👤 Auth User:", user);

      if (!user) {
        // اگر بعد از 3 ثانیه هنوز یوزر لود نشد، لودینگ را ببند
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
      }

      // استفاده از ایمیل یا یوزرنیم (هر کدام که پر بود)
      const identifier = user.username || (user as any).email;

      if (!identifier) {
        console.error("❌ No identifier found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await orderService.getOrdersByUser(identifier);
        setOrders(data);
        setError(null);
      } catch (err: any) {
        console.error("❌ API Error:", err);
        setError("Logistics Server Unreachable");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'TRACKING ID', 
      width: 250,
      renderCell: (p: any) => <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>{p.value}</Typography>
    },
    { 
      field: 'createdAt', 
      headerName: 'DATE', 
      width: 200,
      valueFormatter: (value: any) => value ? new Date(value).toLocaleString() : 'N/A'
    },
    { 
      field: 'totalPrice', 
      headerName: 'TOTAL (USD)', 
      width: 150,
      renderCell: (p: any) => <b>${p.value?.toLocaleString()}</b>
    },
    {
      field: 'status',
      headerName: 'SAGA STATUS',
      width: 180,
      renderCell: (p: any) => (
        <Chip 
          label={p.value || 'Processing'} 
          color={getStatusColor(p.value as string)} 
          variant="filled" 
          size="small" 
          sx={{ fontWeight: 'bold', borderRadius: 0, width: 120 }}
        />
      )
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Synchronizing with Logistics Service...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>
            Orders Ledger
          </Typography>
          <Typography variant="caption" color="text.secondary">
            B2B PROCUREMENT TRACKING SYSTEM
          </Typography>
        </Box>

        {error && <Alert severity="error" variant="filled" sx={{ borderRadius: 0 }}>{error}</Alert>}
        
        <Paper variant="outlined" sx={{ width: '100%', height: 500, borderRadius: 0, border: '2px solid #eee' }}>
          <DataGrid
            rows={orders}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25]}
            sx={{ 
              border: 0,
              '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8f9fa', borderRadius: 0 }
            }}
          />
        </Paper>
      </Stack>
    </Box>
  );
}
