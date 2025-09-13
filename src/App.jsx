import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import RecordingStudio from './pages/RecordingStudio.jsx';
import './styles/main.css';
import NotePage from './pages/NotePage.jsx';
import GradingDemo from './pages/GradingDemo.jsx';
import Toasts from './components/ui/Toasts.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/record" element={<RecordingStudio />} />
        <Route path="/n/:id" element={<NotePage />} />
        <Route path="/grading" element={<GradingDemo />} />
      </Routes>
      <Toasts />
    </Router>
  );
}

export default App;