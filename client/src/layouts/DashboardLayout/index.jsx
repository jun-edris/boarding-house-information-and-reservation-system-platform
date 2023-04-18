import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
	return (
		<>
			<Box sx={{ display: 'flex' }}>
				<Sidebar />
				<Box sx={{ flexGrow: 1, px: 5, py: 4 }}>
					{/* <Header /> */}
					<Outlet />
					{/* <Box component='main' sx={{ flexGrow: 1, px: 3, pt: 5, pb: 2 }}>
					</Box> */}
				</Box>
			</Box>
		</>
	);
};

export default DashboardLayout;
