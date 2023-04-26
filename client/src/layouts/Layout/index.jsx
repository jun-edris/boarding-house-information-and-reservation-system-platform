import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer';

const Layout = () => {
  return (
    <div>
      <Header />
      <Box sx={{ height: '100%', backgroundColor: 'white' }}>
        <Outlet />
      </Box>
      <Footer />
    </div>
  );
};

export default Layout;
