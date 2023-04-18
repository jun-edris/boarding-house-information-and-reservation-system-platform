import { Suspense, lazy, useContext } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import SuspenseLoader from '../../components/SuspenseLoader';

const Loader = (Component) => (props) =>
	(
		<Suspense fallback={<SuspenseLoader />}>
			<Component {...props} />
		</Suspense>
	);

const Dashboard = Loader(lazy(() => import('../../pages/Dashboard')));
const Home = Loader(lazy(() => import('../../pages/Home')));
const PendingHouse = Loader(lazy(() => import('../../pages/Dashboard/BoardingHouse/Pending')));
const ApprovedHouses = Loader(lazy(() => import('../../pages/Dashboard/BoardingHouse/Approved')));
const Tenant = Loader(lazy(() => import('../../pages/Dashboard/Users')));
const LivingTenant = Loader(lazy(() => import('../../pages/Dashboard/BoardingHouse/Living')));
const PendingReservation = Loader(lazy(() => import('../../pages/Dashboard/Reservation/Pending')));
const ExpiredReservation = Loader(lazy(() => import('../../pages/Dashboard/Reservation/Expired')));
const Landlord = Loader(lazy(() => import('../../pages/Dashboard/Users/Landlord')));
const Profile = Loader(lazy(() => import('../../pages/Profile')));
const BoardingHouse = Loader(lazy(() => import('../../pages/Dashboard/BoardingHouse')));

const AdminRoute = ({ children, ...rest }) => {
	const authContext = useContext(AuthContext);

	if (!authContext.isAuthenticated() && !authContext.isAdmin()) {
		return <Navigate to='/' />;
	}
	return <Outlet />;
};

const LandlordRoute = ({ children, ...rest }) => {
	const authContext = useContext(AuthContext);

	if (!authContext.isAuthenticated() && !authContext?.isLandLord()) {
		return <Navigate to='/' />;
	}
	return <Outlet />;
};

const DashboardRoutes = {
	path: '/',
	element: <DashboardLayout />,
	children: [
		{
			element: <AdminRoute />,
			children: [
				{
					path: '/dashboard',
					element: <Dashboard />,
				},
				{
					path: '/user/landlord',
					element: <Landlord />,
				},
				{
					path: '/user/tenant',
					element: <Tenant />,
				},
				{
					path: '/boardingHouse/pending',
					element: <PendingHouse />,
				},
				{
					path: '/boardingHouse/approved',
					element: <ApprovedHouses />,
				},
				{
					path: '/admin/profile/:id',
					element: <Profile />,
				},
			],
		},
		{
			element: <LandlordRoute />,
			children: [
				{
					path: '/',
					element: <Home />,
				},
				{
					path: '/dashboard',
					element: <Dashboard />,
				},
				{
					path: '/boardingHouse',
					element: <BoardingHouse />,
				},
				{
					path: '/reservation/pending',
					element: <PendingReservation />,
				},
				{
					path: '/reservation/expired',
					element: <ExpiredReservation />,
				},
				{
					path: '/boardingHouse/tenants',
					element: <LivingTenant />,
				},
				{
					path: '/landlord/profile/:id',
					element: <Profile />,
				},
			],
		},
	],
};

export default DashboardRoutes;
