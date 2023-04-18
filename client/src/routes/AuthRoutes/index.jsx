import { Suspense, lazy, useContext } from 'react';
// import Layout from '../../layouts/Layout';
import { Navigate, Outlet } from 'react-router-dom';
import SuspenseLoader from '../../components/SuspenseLoader';
import { AuthContext } from '../../context/AuthContext';

const Loader = (Component) => (props) =>
	(
		<Suspense fallback={<SuspenseLoader />}>
			<Component {...props} />
		</Suspense>
	);
const Login = Loader(lazy(() => import('../../pages/Auth/Login')));
const Register = Loader(lazy(() => import('../../pages/Auth/Register')));

const AuthRoute = ({ children, ...rest }) => {
	const authContext = useContext(AuthContext);
	if (!authContext.isAuthenticated()) {
		return <Outlet />;
	}
	if (authContext.isAuthorized()) {
		return <Navigate to='/dashboard' />;
	}
	return <Navigate to='/home' />;
};

const AuthRoutes = {
	path: '/',
	element: <AuthRoute />,
	children: [
		{
			path: '/',
			element: <Login />,
		},
		{
			path: '/register',
			element: <Register />,
		},
	],
};

export default AuthRoutes;
