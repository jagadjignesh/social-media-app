import './css/App.css';
import LoginForm from './components/login.jsx'; 
import { BrowserRouter, Routes , Route } from 'react-router-dom';
import Home from './components/home.jsx';
import RegisterForm from './components/register.jsx';
import Dashboard from './components/dashboard.jsx';
import { ToastContainer} from 'react-toastify';
import ResetPasswordEmailForm from './components/resetpasswordemailform.jsx';
import ResetPassword from './components/resetpassword.jsx';

function App() {
	return (
		<BrowserRouter>
			<ToastContainer />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<LoginForm />} />
				<Route path="/register" element={<RegisterForm />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/reset-password/:token" element={<ResetPassword />} />
				<Route path="/reset-password/" element={<ResetPasswordEmailForm />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
