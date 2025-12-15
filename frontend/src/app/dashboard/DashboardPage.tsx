import { Box, Typography } from '@mui/material';
import StatCard from '../../shared/ui/StatCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DnsIcon from '@mui/icons-material/Dns';

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.main">
        Executive Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Real-time overview of supply chain operations.
      </Typography>

      {/* لی‌اوت گرید با CSS استاندارد (بدون کامپوننت Grid) */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, // ریسپانسیو: 1 ستون، 2 ستون، 4 ستون
        gap: 3 
      }}>
        
        {/* ویجت ۱: سفارشات */}
        <StatCard 
          title="Total Orders" 
          value="1,245" 
          icon={ShoppingCartIcon} 
          color="#1976d2" 
        />

        {/* ویجت ۲: درآمد */}
        <StatCard 
          title="Total Revenue" 
          value="$452k" 
          icon={AttachMoneyIcon} 
          color="#2e7d32" 
        />

        {/* ویجت ۳: محصولات */}
        <StatCard 
          title="Products" 
          value="86" 
          icon={InventoryIcon} 
          color="#ed6c02" 
        />

        {/* ویجت ۴: وضعیت سیستم */}
        <StatCard 
          title="System Status" 
          value="Healthy" 
          icon={DnsIcon} 
          color="#0288d1" 
        />

      </Box>

      {/* نمودار (Placeholder) */}
      <Box sx={{ mt: 4, p: 4, border: '2px dashed #e0e0e0', borderRadius: 2, textAlign: 'center', color: 'text.secondary' }}>
        Activity Chart Component (Coming Soon)
      </Box>
    </Box>
  );
}
