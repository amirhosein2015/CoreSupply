// src/app/pages/catalog/ProductListPage.tsx

import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Paper, Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // ✅ آیکون جدید

import { catalogService } from '../../../domain/services/catalogService';
import { Product } from '../../../domain/models/Product';
import { CreateProductDialog, CreateProductInputs } from './components/CreateProductDialog';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { useBasket } from '../../../infrastructure/context/BasketContext'; // ✅ هوک جدید

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

  // ✅ دسترسی به متد سبد خرید
  const { addToBasket } = useBasket();

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
      }
      handleCloseDialog();
      await fetchProducts(); 
    } catch (error: any) {
      console.error("Operation failed", error);
      alert("Operation failed! Check console.");
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
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ هندلر ساده برای دکمه خرید
  const handleAddToCart = async (product: Product) => {
    try {
      await addToBasket(product);
      alert(`${product.name} added to cart!`); 
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart.");
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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160, // عرض بیشتر برای 3 دکمه
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          
          {/* ✅ دکمه جدید: افزودن به سبد */}
          <Tooltip title="Add to Cart">
            <IconButton 
              color="success" 
              onClick={() => handleAddToCart(params.row as Product)}
              size="small"
            >
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Product">
            <IconButton 
              color="primary" 
              onClick={() => handleOpenEdit(params.row as Product)}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Product">
            <IconButton 
              color="error" 
              onClick={() => handleRequestDelete(params.row.id)}
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

      {/* Dialog for Create/Edit */}
      <CreateProductDialog 
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        isLoading={isSaving}
        productToEdit={selectedProduct}
      />

      {/* Dialog for Delete Confirmation */}
      <ConfirmDialog 
        open={isDeleteOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isDeleting}
      />
    </Box>
  );
}
