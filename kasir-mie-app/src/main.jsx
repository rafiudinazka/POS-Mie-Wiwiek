import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')

// Error handling untuk development
if (process.env.NODE_ENV === 'development') {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
} else {
  // Error handling untuk production
  try {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  } catch (error) {
    console.error('Application failed to render:', error)
    root.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Something went wrong</h1>
        <p>The application failed to load. Please try refreshing the page.</p>
        <pre style="text-align: left; margin-top: 20px; padding: 10px; background: #f5f5f5;">
          ${error.message}
        </pre>
      </div>
    `
  }
}
