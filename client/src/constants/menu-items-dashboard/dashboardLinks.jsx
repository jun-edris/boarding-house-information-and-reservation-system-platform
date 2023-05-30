import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import FaceIcon from '@mui/icons-material/Face';
import GiteIcon from '@mui/icons-material/Gite';
import HouseIcon from '@mui/icons-material/House';

export const dashboardUserLinks = {
  title: 'List of Users',
  children: [
    {
      id: 'landlord',
      title: 'All House Owners',
      type: 'item',
      url: '/user/landlord',
      allowedRoles: ['admin'],
      icon: <SupervisorAccountIcon />,
    },
    {
      id: 'tenant',
      title: 'All Boarders',
      type: 'item',
      url: '/user/tenant',
      allowedRoles: ['admin'],
      icon: <FaceIcon />,
    },
  ],
};
export const dashboardBHLinks = {
  title: 'List of Boarding House',
  children: [
    {
      id: 'pending',
      title: 'To Approve',
      type: 'item',
      url: '/boardingHouse/pending',
      allowedRoles: ['admin'],
      icon: <GiteIcon />,
    },
    {
      id: 'approved',
      title: 'Approved',
      type: 'item',
      url: '/boardingHouse/approved',
      allowedRoles: ['admin'],
      icon: <HouseIcon />,
    },
  ],
};

export const landlordLinks = {
  children: [
    {
      id: 'boardinghouse',
      title: 'My Boarding House',
      type: 'item',
      url: '/boardingHouse',
      allowedRoles: ['landlord'],
      icon: <GiteIcon />,
    },
    {
      id: 'livingTenants',
      title: 'Boarders',
      type: 'item',
      url: '/boardingHouse/tenants',
      allowedRoles: ['landlord'],
      icon: <FaceIcon />,
    },
  ],
};

export const dashboardTenantLinks = {
  title: 'Reservation',
  children: [
    {
      id: 'pending',
      title: 'To Reserve',
      type: 'item',
      url: '/reservation/pending',
      allowedRoles: ['landlord'],
      icon: <FaceIcon />,
    },
    {
      id: 'expired',
      title: 'Out Of Date',
      type: 'item',
      url: '/reservation/expired',
      allowedRoles: ['landlord'],
      icon: <FaceIcon />,
    },
  ],
};
