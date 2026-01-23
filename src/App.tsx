import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './components/pages'
import ThemeToggle from './components/common/ThemeToggle'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ThemeToggle />
    </>
  )
}

export default App
