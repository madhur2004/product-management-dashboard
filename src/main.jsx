import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Mount the React app to the #root element in index.html.
// StrictMode enables extra development warnings (no effect in production).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)