// src/app/pages/catalog/ProductListPage.tsx

import { useEffect, useState, useCallback } from 'react';
import { 
  Box, Typography, Paper, Button, IconButton, 
  Tooltip, Stack, Chip, CircularProgress 
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 

import { catalogService } from '../../../domain/services/catalogService';
import { Product } from '../../../domain/models/Product';
import { CreateProductDialog, CreateProductInputs } from './components/CreateProductDialog';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { useBasket } from '../../../infrastructure/context/BasketContext'; 
import { useToast } from '../../../infrastructure/context/ToastContext';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addToBasket } = useBasket();
  const { showToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await catalogService.getProducts();
      setProducts(data);
    } catch (error) {
      showToast("REGISTRY_OFFLINE", 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleOpenCreate = () => { setSelectedProduct(null); setIsDialogOpen(true); };
  const handleOpenEdit = (p: Product) => { setSelectedProduct(p); setIsDialogOpen(true); };
  const handleCloseDialog = () => { setIsDialogOpen(false); setSelectedProduct(null); };

  const handleFormSubmit = async (data: CreateProductInputs) => {
    try {
      setIsSaving(true);
      if (selectedProduct) {
        await catalogService.updateProduct({ ...selectedProduct, ...data, price: Number(data.price) });
        showToast("ASSET_RECORD_UPDATED", 'success');
      } else {
        const newId = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        await catalogService.createProduct({ ...data, id: newId, price: Number(data.price) });
        showToast("NEW_ASSET_REGISTERED", 'success');
      }
      handleCloseDialog();
      await fetchProducts(); 
    } catch (error) {
      showToast("DATABASE_WRITE_ERROR", 'error');
    } finally { setIsSaving(false); }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      await catalogService.deleteProduct(deleteTargetId);
      showToast("ASSET_PURGED", 'success');
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
      await fetchProducts();
    } finally { setIsDeleting(false); }
  };

  const columns: GridColDef[] = [
    { 
      field: 'imageFile', 
      headerName: 'VISUAL_REF', 
      width: 100,
      sortable: false,
      renderCell: (p: any) => {
        const name = p.row.name?.toLowerCase() || '';
        const id = p.row.id || 'default';
        const imageMap: { [key: string]: string } = {
          'wheel': 'https://images.unsplash.com/photo-1486049093342-98ed3403ba02?w=100',
          'gear': 'https://images.unsplash.com/photo-1530124560676-1adc822703aa?w=100',
          'engine': 'https://images.unsplash.com/photo-1590846021111-83b983d48b59?w=100',
          'circuit': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100',
          'chip': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100',
          'box': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100'
        };
        const matchedKey = Object.keys(imageMap).find(key => name.includes(key));
        const fallbackUrl = `https://picsum.photos/seed/${id}/100/100?grayscale&blur=1`;
        const primaryUrl = p.value?.startsWith('http') ? p.value : (matchedKey ? imageMap[matchedKey] : fallbackUrl);

        return (
          <Box sx={{ p: 1, display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box component="img" src={primaryUrl} onError={(e: any) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100'; }}
              sx={{ width: 48, height: 48, objectFit: 'cover', border: '1px solid rgba(0, 229, 255, 0.3)', filter: 'contrast(1.2) brightness(0.8)', bgcolor: '#000' }} 
            />
          </Box>
        );
      }
    },
    { 
      field: 'name', 
      headerName: 'COMPONENT_IDENTITY', 
      flex: 1, 
      minWidth: 200,
      renderCell: (p: any) => (
        <Stack sx={{ py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: '900', color: 'primary.main' }}>{p.value?.toUpperCase()}</Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.6rem' }}>HEX_ID: {p.row.id?.toUpperCase()}</Typography>
        </Stack>
      )
    },
    { 
      field: 'category', 
      headerName: 'ASSET_CLASS', 
      width: 150,
      renderCell: (p: any) => <Chip label={p.value?.toUpperCase()} size="small" variant="outlined" sx={{ borderRadius: 0, fontSize: '0.65rem', borderColor: 'secondary.main', color: 'secondary.main', fontWeight: 'bold' }} />
    },
    { 
      field: 'price', 
      headerName: 'VALUE (USD)', 
      width: 150,
      renderCell: (p: any) => <Typography sx={{ fontWeight: '900', fontFamily: 'monospace' }}>${p.value?.toLocaleString()}</Typography>
    },
    {
      field: 'actions', headerName: 'OPERATIONS', width: 160, sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="success" onClick={() => addToBasket(params.row)} size="small"><ShoppingCartIcon fontSize="small" /></IconButton>
          <IconButton color="primary" onClick={() => handleOpenEdit(params.row as Product)} size="small"><EditIcon fontSize="small" /></IconButton>
          <IconButton color="error" onClick={() => { setDeleteTargetId(params.row.id); setIsDeleteOpen(true); }} size="small"><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: 1400, margin: '0 auto' }}>
      <Stack spacing={4}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Stack>
            <Typography variant="h4" color="primary.main" sx={{ letterSpacing: 3 }}>INDUSTRIAL COMPONENT REGISTRY</Typography>
            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'bold', letterSpacing: 1 }}>B2B_INVENTORY_CONTROL / SAGA_READY_ASSETS</Typography>
          </Stack>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate} sx={{ borderRadius: 0, px: 4, py: 1.5, bgcolor: 'primary.main', color: '#000' }}>
            REGISTER_NEW_COMPONENT
          </Button>
        </Box>
        <Paper variant="outlined" sx={{ height: 650, bgcolor: 'rgba(10, 25, 47, 0.4)', borderRadius: 0 }}>
          <DataGrid rows={products} columns={columns} loading={loading} getRowId={(row) => row.id} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} pageSizeOptions={[10, 25, 50]}
            sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { backgroundColor: 'rgba(0, 229, 255, 0.05)', color: 'primary.main', fontWeight: '900' }, '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(255, 255, 255, 0.05)' } }} />
        </Paper>
      </Stack>
      <CreateProductDialog open={isDialogOpen} onClose={handleCloseDialog} onSubmit={handleFormSubmit} isLoading={isSaving} productToEdit={selectedProduct} />
      <ConfirmDialog open={isDeleteOpen} title="PURGE_CONFIRMATION" message="INITIATING PERMANENT DELETE COMMAND. PROCEED?" onConfirm={handleConfirmDelete} onCancel={() => setIsDeleteOpen(false)} isLoading={isDeleting} />
    </Box>
  );
}
