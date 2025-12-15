// src/app/pages/catalog/components/CreateProductDialog.tsx

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 1. تعریف Schema با Zod برای اعتبارسنجی
const createProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  summary: z.string().optional(),
  description: z.string().optional(),
  imageFile: z.string().optional(), // فعلاً استرینگ می‌گیریم طبق درخواست
  price: z.number().min(0.01, "Price must be greater than 0"),
});

// استخراج تایپ از اسکیما
export type CreateProductInputs = z.infer<typeof createProductSchema>;

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductInputs) => void;
  isLoading?: boolean;
}

export const CreateProductDialog: React.FC<CreateProductDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
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

  // هندل کردن بستن فرم و ریست کردن آن
  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit: SubmitHandler<CreateProductInputs> = (data) => {
    onSubmit(data);
    // نکته: ریست کردن فرم را معمولاً پس از موفقیت آمیز بودن API انجام می‌دهیم
    // اما اینجا فعلا فقط لاجیک UI مدنظر است.
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Stack spacing={2}>
            {/* Product Name */}
            <TextField
              label="Product Name"
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            {/* Category */}
            <TextField
              label="Category"
              fullWidth
              {...register('category')}
              error={!!errors.category}
              helperText={errors.category?.message}
            />

             {/* Price */}
             <TextField
              label="Price"
              type="number"
              fullWidth
              {...register('price', { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            {/* Summary */}
            <TextField
              label="Summary"
              multiline
              rows={2}
              fullWidth
              {...register('summary')}
            />

            {/* Description */}
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              {...register('description')}
            />

            {/* Image File (Placeholder for now) */}
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
            {isLoading ? 'Saving...' : 'Create Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
