import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { catalogService } from '../../domain/services/catalogService';
import { Product } from '../../domain/models/Product';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await catalogService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // تعریف ستون‌های جدول
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Product Name', flex: 1, minWidth: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 120,
      renderCell: (params) => (
        <Typography fontWeight="bold" color="primary">
          ${params.value}
        </Typography>
      )
    },
    { 
      field: 'summary', 
      headerName: 'Summary', 
      flex: 2,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {params.value}
        </Typography>
      )
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.main">
        Product Catalog
      </Typography>
      
      <Paper elevation={2} sx={{ height: '100%', width: '100%', p: 1 }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id} // چون فیلد ما id است (نه ID)
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            },
          }}
        />
      </Paper>
    </Box>
  );
}
