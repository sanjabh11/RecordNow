import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Fade-in on scroll for elements with .reveal
const initReveal = () => {
  const elements = Array.from(document.querySelectorAll('.reveal'))
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('reveal-visible'))
    return
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
  elements.forEach(el => observer.observe(el))
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initReveal, 0)
} else {
  window.addEventListener('DOMContentLoaded', initReveal)
}