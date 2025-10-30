import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Import our global Tailwind styles
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* We wrap our App with the router */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)