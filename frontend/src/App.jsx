import ThresholdForm from './components/ThresholdForm'
import AnalyzePage from './components/KPIAnalysisPage'
import PreviewPage from './components/PreviewPage'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ThresholdForm />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
