// src/app/pages/catalog/ProductListPage.tsx

import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Paper, Button, IconButton, Tooltip } from '@mui/material'; // IconButton اضافه شد
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; // آیکون حذف اضافه شد

import { catalogService } from '../../../domain/services/catalogService';
import { Product } from '../../../domain/models/Product';
import { CreateProductDialog, CreateProductInputs } from './components/CreateProductDialog';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await catalogService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  const generateMongoId = () => {
    return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const handleCreateSubmit = async (data: CreateProductInputs) => {
    try {
      setIsSaving(true);
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
      handleCloseCreate();
      await fetchProducts(); 
    } catch (error: any) {
      console.error("Failed to create product", error);
      if (error.response && error.response.data) {
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Error creating product! Check console for details.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ متد جدید: هندل کردن حذف محصول
  const handleDelete = async (id: string) => {
    // 1. تاییدیه گرفتن از کاربر (UX ساده)
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setLoading(true); // نشان دادن حالت لودینگ روی جدول
      
      // 2. صدا زدن سرویس حذف
      await catalogService.deleteProduct(id);
      
      // 3. رفرش کردن لیست
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product. Please try again.");
      setLoading(false); // اگر خطا داد، لودینگ را خاموش کن
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Product Name', flex: 1, minWidth: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography fontWeight="bold" color="primary" variant="body2">
            ${params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'summary', 
      headerName: 'Summary', 
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {params.value}
          </Typography>
        </Box>
      )
    },
    // ✅ ستون جدید: Actions
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false, // دکمه‌ها نباید سورت شوند
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Tooltip title="Delete Product">
            <IconButton 
              color="error" 
              onClick={() => handleDelete(params.row.id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Product Catalog
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenCreate}
          size="large"
        >
          Add Product
        </Button>
      </Box>
      
      <Paper elevation={2} sx={{ height: '100%', width: '100%', p: 1 }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>

      <CreateProductDialog 
        open={isCreateOpen}
        onClose={handleCloseCreate}
        onSubmit={handleCreateSubmit}
        isLoading={isSaving}
      />
    </Box>
  );
}
