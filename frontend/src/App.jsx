import ThresholdForm from './components/forms/ThresholdForm'
import AnalyzePage from './components/pages/KPIAnalysisPage'
import PreviewPage from './components/pages/PreviewPage'
import ScreenConfigPage from './components/pages/ScreenConfigPage'
import Navigation from './components/layout/Navigation'
import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

function AppContent() {
  const location = useLocation();
  const isAnalysisPage = location.pathname !== '/' && location.pathname !== '/preview' && location.pathname !== '/screens';
  
  return (
    <>
      {!isAnalysisPage && <Navigation />}
      <Routes>
        <Route path="/" element={<ThresholdForm />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/screens" element={<ScreenConfigPage />} />
        <Route path="/shows/:displayName" element={<AnalyzePage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
