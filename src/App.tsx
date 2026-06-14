import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Pricing from './pages/Pricing'
import Diagnostico from './pages/Diagnostico'
import Plan from './pages/Plan'
import InvestmentSimulator from './pages/InvestmentSimulator'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Landing />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>
        <Route path="diagnostico" element={<Diagnostico />} />
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="plan" element={<Plan />} />
          <Route path="investment-simulator" element={<InvestmentSimulator />} />
          <Route path="chat" element={<Chat />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
