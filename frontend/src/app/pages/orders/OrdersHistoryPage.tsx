import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Stack, Alert, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAuth } from '../../../infrastructure/auth/AuthContext';
import { orderService } from '../../../domain/services/orderService';
import { OrderSummary } from '../../../domain/models/Order';

const getStatusColor = (status: string): any => {
  const s = status?.toLowerCase() || '';
  if (s.includes('pending') || s.includes('wait')) return 'warning'; 
  if (s.includes('fail') || s.includes('cancel')) return 'error';
  if (s.includes('paid') || s.includes('success')) return 'success';
  return 'primary';
};

export default function OrdersHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const identifier = user?.username || (user as any)?.email;
      if (!identifier) return;
      try {
        setLoading(true);
        const data = await orderService.getOrdersByUser(identifier);
        setOrders(data);
      } catch (err) {
        setError("SAGA_LINK_FAILURE");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'TRANSACTION_ID', width: 280, renderCell: (p: any) => <code style={{color: '#00e5ff'}}>{p.value}</code> },
    { field: 'createdAt', headerName: 'TIMESTAMP', width: 200, valueFormatter: (v: any) => v ? new Date(v).toLocaleString() : 'N/A' },
    { field: 'totalPrice', headerName: 'VALUE_USD', width: 150, renderCell: (p: any) => <b style={{color: '#00e5ff'}}>${p.value}</b> },
    { 
      field: 'status', headerName: 'CQRS_STATUS', width: 180, 
      renderCell: (p: any) => (
        <Chip label={p.value || 'ASYNC_WAIT'} color={getStatusColor(p.value)} variant="filled" size="small" sx={{ fontWeight: 'bold', borderRadius: 0, width: 130 }} />
      ) 
    }
  ];

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: 2 }}>
      <CircularProgress color="primary" thickness={2} />
      <Typography variant="caption" sx={{ letterSpacing: 3 }}>SYNCING_SAGA_LEDGER...</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 4, maxWidth: 1300, margin: '0 auto' }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" color="primary.main" sx={{ letterSpacing: 2 }}>SAGA TRANSACTION MONITOR</Typography>
          <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>EVENT-DRIVEN ARCHITECTURE | ASYNC PROCUREMENT SYSTEM</Typography>
        </Box>
        <Paper variant="outlined" sx={{ height: 550, bgcolor: 'transparent', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
          <DataGrid rows={orders} columns={columns} getRowId={(row) => row.id} sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { bgcolor: 'rgba(0, 229, 255, 0.05)', color: '#00e5ff' }}} />
        </Paper>
      </Stack>
    </Box>
  );
}
