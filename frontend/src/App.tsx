import { Box, Button, Container, Paper, Typography } from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'
import { Link } from 'react-router-dom' // [New] اضافه شد

function App() {
  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center', width: '100%', borderRadius: 2 }}>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h1" sx={{ fontSize: '4rem' }}>🏭</Typography>
        </Box>

        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          CoreSupply
        </Typography>
        
        <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          Enterprise Supply Chain Platform
        </Typography>

        <Typography variant="body1" paragraph sx={{ mb: 4, color: 'text.secondary' }}>
          Secure, Cloud-Native, and Scalable Solution for B2B Procurement.
        </Typography>

        <Button 
          component={Link} // [New] تبدیل به لینک
          to="/login"      // [New] مسیر مقصد
          variant="contained" 
          size="large" 
          startIcon={<SecurityIcon />}
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          Login to Portal
        </Button>

      </Paper>
    </Container>
  )
}

export default App
