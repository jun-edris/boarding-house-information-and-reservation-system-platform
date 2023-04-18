import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';

const Layout = () => {
	return (
		<div>
			<Header />
			<Box>
				<Outlet />
			</Box>
		</div>
	);
};

export default Layout;
