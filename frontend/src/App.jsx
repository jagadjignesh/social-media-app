import './css/App.css';
import LoginForm from './components/login.jsx'; 
import { BrowserRouter, Routes , Route } from 'react-router-dom';
import RegisterForm from './components/register.jsx';
import Layout from './components/layout.jsx';
import ResetPasswordEmailForm from './components/resetpasswordemailform.jsx';
import ResetPassword from './components/resetpassword.jsx';
import { useContext } from 'react';
import { AppContext } from './contexts/AppContext.jsx';
import Feed from './pages/feed.jsx';
import Message from './pages/message.jsx';
import Connections from './pages/connections.jsx';
import Profile from './pages/profile.jsx';
import CreatePost from './pages/createpost.jsx';

function App() {

	const {isLoggedIn} = useContext(AppContext);

	return (
		<>
			<Routes>
				<Route path="/" element={ isLoggedIn ? <Layout /> : <LoginForm />}>
					<Route index element={<Feed />} />
					<Route path='/feed' element={<Feed />} />
					<Route path='/message' element={<Message />} />
					<Route path='/connections' element={<Connections />} />
					<Route path='/profile' element={<Profile />} />
					<Route path='/profile/:id' element={<Profile />} />
					<Route path='/create-post' element={<CreatePost />} />
				</Route>
				<Route path="/register" element={<RegisterForm />} />
				<Route path="/reset-password/:token" element={<ResetPassword />} />
				<Route path="/reset-password/" element={<ResetPasswordEmailForm />} />
			</Routes>
		</>
	);
}

export default App;
