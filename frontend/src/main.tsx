// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/routes/router'
import { AuthProvider } from './infrastructure/auth/AuthContext'
// ✅ ایمپورت جدید
import { BasketProvider } from './infrastructure/context/BasketContext' 
import { industrialTheme } from './shared/ui/theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={industrialTheme}>
      <CssBaseline />
      <AuthProvider>
        {/* ✅ BasketProvider باید فرزند AuthProvider باشد تا به user دسترسی داشته باشد */}
        <BasketProvider>
          <RouterProvider router={router} />
        </BasketProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

