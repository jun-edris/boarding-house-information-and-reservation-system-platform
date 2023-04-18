import { useRoutes } from 'react-router-dom';
import UserRoutes from './UserRoutes';
import DashboardRoutes from './DashboardRoutes';
import routeConfig from '../config/routeConfig';
import AuthRoutes from './AuthRoutes';

export default function Routes() {
	return useRoutes([AuthRoutes, UserRoutes, DashboardRoutes], routeConfig.basename);
}
