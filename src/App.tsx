import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import RootLayout from './layouts/RootLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Pricing from './pages/Pricing'
import Diagnostico from './pages/Diagnostico'
import Plan from './pages/Plan'
import History from './pages/History'
import Goals from './pages/Goals'
import InvestmentSimulator from './pages/InvestmentSimulator'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public — marketing site */}
          <Route element={<RootLayout />}>
            <Route index element={<Landing />} />
            <Route path="pricing" element={<Pricing />} />
          </Route>

          {/* Public — auth pages (standalone layout) */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Public — diagnostic (no login required; data stored in localStorage) */}
          <Route path="diagnostico" element={<Diagnostico />} />

          {/* Protected — requires authentication */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="plan" element={<Plan />} />
              <Route path="history" element={<History />} />
              <Route path="goals" element={<Goals />} />
              <Route path="investment-simulator" element={<InvestmentSimulator />} />
              <Route path="chat" element={<Chat />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
