// src/app/pages/catalog/ProductListPage.tsx

import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Paper, Button, IconButton, Tooltip, Stack, Chip } from '@mui/material';
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
  
  // States for Create/Edit Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // States for Delete Dialog
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
      console.error("Failed to load products", error);
      showToast("REGISTRY_FETCH_FAILED", 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Handlers for Create/Edit ---
  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const generateMongoId = () => {
    return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const handleFormSubmit = async (data: CreateProductInputs) => {
    try {
      setIsSaving(true);
      if (selectedProduct) {
        await catalogService.updateProduct({
          id: selectedProduct.id,
          name: data.name,
          category: data.category,
          price: Number(data.price),
          summary: data.summary || '',
          description: data.description || '',
          imageFile: data.imageFile || 'default.png'
        });
        showToast("COMPONENT_UPDATED_SUCCESSFULLY", 'success');
      } else {
        const newId = generateMongoId();
        await catalogService.createProduct({
          id: newId, 
          name: data.name,
          category: data.category,
          price: Number(data.price),
          summary: data.summary || '',
          description: data.description || '',
          imageFile: data.imageFile || 'default.png'
        });
        showToast("NEW_COMPONENT_REGISTERED", 'success');
      }
      handleCloseDialog();
      await fetchProducts(); 
    } catch (error: any) {
      console.error("Operation failed", error);
      showToast("TRANSACTION_LOG_ERROR", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handlers for Delete ---
  const handleRequestDelete = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      await catalogService.deleteProduct(deleteTargetId);
      showToast("COMPONENT_REMOVED_FROM_REGISTRY", 'success');
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
      showToast("DELETION_FAILED", 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToBasket(product);
      showToast(`${product.name.toUpperCase()} ADDED TO QUEUE`, 'success'); 
    } catch (error) {
      console.error(error);
      showToast("BASKET_SYNC_ERROR", 'error');
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'COMPONENT_NAME', 
      flex: 1, 
      minWidth: 200,
      renderCell: (p: any) => <Typography variant="body2" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>{p.value?.toUpperCase()}</Typography>
    },
    { 
      field: 'category', 
      headerName: 'ASSET_CLASS', 
      width: 150,
      renderCell: (p: any) => <Chip label={p.value} size="small" variant="outlined" sx={{ borderRadius: 0, fontSize: '0.7rem' }} />
    },
    { 
      field: 'price', 
      headerName: 'UNIT_VALUE (USD)', 
      width: 150,
      renderCell: (params) => (
        <Typography fontWeight="900" color="primary.main" sx={{ fontFamily: 'monospace' }}>
          ${params.value?.toLocaleString()}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'OPERATIONS',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Add to Queue">
            <IconButton color="success" onClick={() => handleAddToCart(params.row as Product)} size="small">
              <ShoppingCartIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modify Record">
            <IconButton color="primary" onClick={() => handleOpenEdit(params.row as Product)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Purge Record">
            <IconButton color="error" onClick={() => handleRequestDelete(params.row.id)} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: 1400, margin: '0 auto' }}>
      <Stack spacing={4}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Stack>
            <Typography variant="h4" color="primary.main" sx={{ letterSpacing: 2 }}>
              INDUSTRIAL COMPONENT REGISTRY
            </Typography>
            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'bold', letterSpacing: 1 }}>
              B2B INVENTORY MANAGEMENT SYSTEM / ASSET_TRACKING_ENABLED
            </Typography>
          </Stack>

          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenCreate}
            sx={{ 
              borderRadius: 0, 
              px: 4, 
              bgcolor: 'primary.main', 
              color: '#000',
              '&:hover': { bgcolor: '#00b8d4' }
            }}
          >
            REGISTER_NEW_COMPONENT
          </Button>
        </Box>
        
        {/* DataGrid Section */}
        <Paper variant="outlined" sx={{ height: 600, width: '100%', bgcolor: 'transparent', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
          <DataGrid
            rows={products}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25]}
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(0, 229, 255, 0.05)',
                color: 'primary.main',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 1,
                borderBottom: '2px solid rgba(0, 229, 255, 0.2)'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }
            }}
          />
        </Paper>
      </Stack>

      <CreateProductDialog 
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        isLoading={isSaving}
        productToEdit={selectedProduct}
      />

      <ConfirmDialog 
        open={isDeleteOpen}
        title="SYSTEM_CONFIRMATION"
        message="YOU ARE ABOUT TO PERMANENTLY DELETE THIS COMPONENT FROM THE REGISTRY. PROCEED?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isDeleting}
      />
    </Box>
  );
}
