import { Suspense, lazy, useContext } from 'react';
import Layout from '../../layouts/Layout';
import { Navigate, Outlet } from 'react-router-dom';
import SuspenseLoader from '../../components/SuspenseLoader';
import { AuthContext } from '../../context/AuthContext';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );
const RoomLiving = Loader(lazy(() => import('../../pages/RoomLiving')));
const Home = Loader(lazy(() => import('../../pages/Home')));
const BoardingHouseDetails = Loader(
  lazy(() => import('../../pages/BoardingHouseDetails'))
);
const Profile = Loader(lazy(() => import('../../pages/Profile')));

const UserRoute = ({ children, ...rest }) => {
  const authContext = useContext(AuthContext);

  if (!authContext.isAuthenticated() && !authContext.isTenant()) {
    return <Navigate to="/" />;
  }
  // if (!authContext.isAdmin()) return <Outlet />;

  if (
    authContext.isAuthenticated() &&
    authContext.isTenant() &&
    authContext.authState.userInfo.noBH === false
  ) {
    return <Navigate to="/living" />;
  }

  if (
    authContext.isAuthorized() ||
    authContext.isAdmin() ||
    authContext.isLandlord()
  ) {
    return <Navigate to="/dashboard" />;
  }
  return <Outlet />;
};

const ReservedRoute = ({ children, ...rest }) => {
  const authContext = useContext(AuthContext);
  if (
    authContext.isAuthenticated() &&
    authContext.isTenant() &&
    authContext.authState.userInfo.noBH === true
  ) {
    return <Navigate to="/home" />;
  }

  if (
    authContext.isAuthorized() ||
    authContext.isAdmin() ||
    authContext.isLandlord()
  ) {
    return <Navigate to="/dashboard" />;
  }
  return <Outlet />;
};

const UserRoutes = {
  path: '/',
  element: <Layout />,
  children: [
    {
      path: '/',
      element: <UserRoute />,
      children: [
        {
          path: '/home',
          element: <Home />,
        },
        {
          path: '/profile/:id',
          element: <Profile />,
        },
        {
          path: '/boardinghouse/:id',
          element: <BoardingHouseDetails />,
        },
      ],
    },
    {
      path: '/',
      element: <ReservedRoute />,
      children: [
        {
          path: '/living',
          element: <RoomLiving />,
        },
        {
          path: '/profile/living/:id',
          element: <Profile />,
        },
      ],
    },
  ],
};

export default UserRoutes;
