import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AppContext.jsx';
import '@tailwindplus/elements';
import { ToastContainer} from 'react-toastify';
import { BrowserRouter, Routes , Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ToastContainer />
            <AuthProvider>
                <App />
            </AuthProvider>
    </BrowserRouter>
)
