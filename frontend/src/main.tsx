import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom' // مهم
import { router } from './app/routes/router'       // مهم
import { AuthProvider } from './infrastructure/auth/AuthContext'
import { industrialTheme } from './shared/ui/theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={industrialTheme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} /> {/* اینجا باید RouterProvider باشد */}
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
