import { Suspense, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import PlaygroundPage from './pages/index.jsx'
import DocumentPage from './components/DocumentPage'

function App() {
  return (
    <Router basename='/iam-mml/'>
      <Routes>
        <Route path='/' element={<PlaygroundPage />} />
        <Route path='*' element={<DocumentPage />} />
      </Routes>
    </Router>
  )
}

export default App
