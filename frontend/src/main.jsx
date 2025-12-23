import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter as Router} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import './print.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
          <App />
      </Router>
  </StrictMode>,
)
