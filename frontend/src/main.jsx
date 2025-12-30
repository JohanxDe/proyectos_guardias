import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthContext.jsx'
import LoadingProvide from './context/LoadingContex.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LoadingProvide>
        <App />
      </LoadingProvide>
    </AuthProvider>
  </StrictMode>,
)
