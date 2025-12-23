import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            {/* Add other routes here */}
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}
