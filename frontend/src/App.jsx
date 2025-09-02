import ThresholdForm from './components/ThresholdForm'
import AnalyzePage from './components/KPIAnalysisPage'
import PreviewPage from './components/PreviewPage'
import ScreenConfigPage from './components/ScreenConfigPage'
import Navigation from './components/Navigation'
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
        <Route path="/:displayName" element={<AnalyzePage />} />
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
