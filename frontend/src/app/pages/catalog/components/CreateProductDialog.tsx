// src/app/pages/catalog/components/CreateProductDialog.tsx

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '../../../../domain/models/Product'; // مسیر مدل را چک کنید

// تعریف اسکیما
const createProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  summary: z.string().optional(),
  description: z.string().optional(),
  imageFile: z.string().optional(),
  price: z.number().min(0.01, "Price must be greater than 0"),
});

export type CreateProductInputs = z.infer<typeof createProductSchema>;

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductInputs) => void;
  isLoading?: boolean;
  productToEdit?: Product | null; // ✅ پراپ جدید: محصولی که باید ویرایش شود
}

export const CreateProductDialog: React.FC<CreateProductDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  productToEdit
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CreateProductInputs>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      category: '',
      summary: '',
      description: '',
      imageFile: 'default.png',
      price: 0
    }
  });

  // ✅ لاجیک حرفه‌ای: پر کردن فرم هنگام باز شدن در حالت ویرایش
  useEffect(() => {
    if (open) {
      if (productToEdit) {
        // حالت Edit: پر کردن فرم با داده‌های موجود
        reset({
          name: productToEdit.name,
          category: productToEdit.category,
          summary: productToEdit.summary,
          description: productToEdit.description,
          imageFile: productToEdit.imageFile,
          price: productToEdit.price
        });
      } else {
        // حالت Create: خالی کردن فرم
        reset({
          name: '',
          category: '',
          summary: '',
          description: '',
          imageFile: 'default.png',
          price: 0
        });
      }
    }
  }, [open, productToEdit, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit: SubmitHandler<CreateProductInputs> = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* تغییر داینامیک تیتر */}
      <DialogTitle>
        {productToEdit ? `Edit Product: ${productToEdit.name}` : 'Add New Product'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Product Name"
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Category"
              fullWidth
              {...register('category')}
              error={!!errors.category}
              helperText={errors.category?.message}
            />
             <TextField
              label="Price"
              type="number"
              fullWidth
              {...register('price', { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <TextField
              label="Summary"
              multiline
              rows={2}
              fullWidth
              {...register('summary')}
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              {...register('description')}
            />
            <TextField
              label="Image File Name"
              fullWidth
              {...register('imageFile')}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading}
          >
            {/* تغییر داینامیک متن دکمه */}
            {isLoading ? 'Saving...' : (productToEdit ? 'Update Changes' : 'Create Product')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
