import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Gold from './pages/Gold'
import Currency from './pages/Currency'
import Petrol from './pages/Petrol'
import CurrencyHistory from './pages/CurrencyHistory'
import GoldHistory from './pages/GoldHistory'
import Login from './pages/Login'
import Admin from './pages/Admin'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Contact from './pages/Contact'
import About from './pages/About'
import NotFound from './pages/NotFound'

// Component to handle 404 redirect from sessionStorage
function RedirectHandler() {
  const navigate = useNavigate()
  
  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect')
    if (redirect) {
      sessionStorage.removeItem('redirect')
      navigate(redirect, { replace: true })
    }
  }, [navigate])
  
  return null
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <RedirectHandler />
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gold" element={<Gold />} />
              <Route path="/currency" element={<Currency />} />
              <Route path="/petrol" element={<Petrol />} />
              <Route path="/currency-history/:code" element={<CurrencyHistory />} />
              <Route path="/gold-history" element={<GoldHistory />} />
              <Route path="/gold-history/:type" element={<GoldHistory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
