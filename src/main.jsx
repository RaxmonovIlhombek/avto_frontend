import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-right" toastOptions={{
              style: {
                background: '#16161d',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1rem',
              }
            }} />
            <App />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
