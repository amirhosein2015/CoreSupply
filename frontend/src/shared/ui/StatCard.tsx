import { Paper, Box, Typography, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  color?: string;
}

export default function StatCard({ title, value, icon: Icon, color = '#003057' }: StatCardProps) {
  return (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {title.toUpperCase()}
        </Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ 
        p: 1.5, 
        borderRadius: '50%', 
        bgcolor: `${color}15`, // ۱۰٪ شفافیت
        color: color 
      }}>
        <Icon sx={{ fontSize: 32 }} />
      </Box>
    </Paper>
  );
}
