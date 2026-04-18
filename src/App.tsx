import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import ExamDetails from './pages/ExamDetails'
import Integrations from './pages/Integrations'
import Subscription from './pages/Subscription'
import Appointments from './pages/Appointments'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Report from './pages/Report'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import LeadSuccess from './pages/LeadSuccess'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/exame/:id" element={<ExamDetails />} />
          <Route path="/integracoes" element={<Integrations />} />
          <Route path="/assinatura" element={<Subscription />} />
          <Route path="/consultas" element={<Appointments />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/relatorio/:id" element={<Report />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/sucesso-lead" element={<LeadSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
