import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FetchContext } from './../../context/FetchContext';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { AuthContext } from '../../context/AuthContext';
import DisplayCount from '../../components/common/DisplayCount';
import PeopleIcon from '@mui/icons-material/People';
import ReservedChart from '../../components/Charts/ReservedChart';
import PendingChart from '../../components/Charts/PendingChart';
import UserRegistered from '../../components/Charts/UserRegistered';

const Dashboard = () => {
  const fetchContext = useContext(FetchContext);
  const authContext = useContext(AuthContext);
  const [landlordCount, setLandlordCount] = useState(0);
  const [tenantCount, setTenantCount] = useState(0);
  const [pendingBHCount, setPendingBHCount] = useState(0);
  const [approvedBHCount, setApprovedBHCount] = useState(0);
  const [roomTenants, setRoomTenants] = useState([]);
  const [roomTenantsToLive, setRoomTenantsToLive] = useState([]);
  const [roomTenantsToLeave, setRoomTenantsToLeave] = useState([]);
  const [pendingRToAccept, setPendingRToAccept] = useState([]);
  const [pendingRToCancel, setPendingRToCancel] = useState([]);
  const [allLandlord, setAllLandlord] = useState([]);
  const [allTenant, setAllTenant] = useState([]);

  const getAllLandlord = () => {
    fetchContext.authAxios
      .get(`/admin/user/landlord`)
      .then(({ data }) => {
        setAllLandlord(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllTenant = () => {
    fetchContext.authAxios
      .get(`/admin/user/tenant`)
      .then(({ data }) => {
        setAllTenant(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const expiredReservation = async () => {
    fetchContext.authAxios
      .patch(`/reservation/expire`)
      .then(({ data }) => {
        console.log(data.msg);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getLandlordCount = () => {
    fetchContext.authAxios
      .get(`/admin/user/landlord/count`)
      .then(({ data }) => {
        setLandlordCount(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTenantCount = () => {
    fetchContext.authAxios
      .get(`/admin/user/tenant/count`)
      .then(({ data }) => {
        setTenantCount(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPendingBHCount = () => {
    fetchContext.authAxios
      .get(`/admin/boardinghouse/pending/count`)
      .then(({ data }) => {
        setPendingBHCount(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getLandlordRoomTenants = () => {
    fetchContext.authAxios
      .get(`/boardinghouse/tenants`)
      .then(({ data }) => {
        setRoomTenants(data.tenants);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTenantRequestToLiveReservation = () => {
    fetchContext.authAxios
      .get(`/boardinghouse/tenants/to-live`)
      .then(({ data }) => {
        setRoomTenantsToLive(data.tenants);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTenantRequestToLeaveReservation = () => {
    fetchContext.authAxios
      .get(`/boardinghouse/tenants/to-leave`)
      .then(({ data }) => {
        setRoomTenantsToLeave(data.tenants);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getApprovedBHCount = () => {
    fetchContext.authAxios
      .get(`/admin/boardinghouse/approved/count`)
      .then(({ data }) => {
        setApprovedBHCount(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pendingReservationToAccept = async () => {
    fetchContext.authAxios
      .get(`pendingReservationToAccept`)
      .then(({ data }) => {
        setPendingRToAccept(data.pending);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pendingReservationToCancel = async () => {
    fetchContext.authAxios
      .get(`/reservation/pending-to-cancel`)
      .then(({ data }) => {
        setPendingRToCancel(data.pending);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getNotif = async () => {
    fetchContext.authAxios
      .patch(`/notify`)
      .then(({ data }) => {
        console.log(data.msg);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    expiredReservation();
    getNotif();

    if (authContext.authState.userInfo.role === 'admin') {
      getAllLandlord();
      getAllTenant();
      getLandlordCount();
      getTenantCount();
      getPendingBHCount();
      getApprovedBHCount();
    }

    if (authContext.authState.userInfo.role === 'landlord') {
      getLandlordRoomTenants();
      pendingReservationToAccept();
      pendingReservationToCancel();
      getTenantRequestToLiveReservation();
      getTenantRequestToLeaveReservation();
    }

    const notifChannel = authContext.pusher.subscribe('notify');

    notifChannel.bind('notify-landlord', (newReq) => {
      if (authContext.authState.userInfo.role === 'admin') {
        getAllLandlord();
        getAllTenant();
        getLandlordCount();
        getTenantCount();
        getPendingBHCount();
        getApprovedBHCount();
      }

      if (authContext.authState.userInfo.role === 'landlord') {
        getLandlordRoomTenants();
        pendingReservationToAccept();
        pendingReservationToCancel();
        getTenantRequestToLiveReservation();
        getTenantRequestToLeaveReservation();
      }

      // setRecords((records) => [...records, newReq]);
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box>
        <Paper
          sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}
          variant="outlined"
        >
          <Avatar
            alt={
              authContext.authState.userInfo
                ? `${authContext.authState.userInfo.firstName} ${authContext.authState.userInfo.lastName}`
                : ''
            }
            src={
              authContext.authState.userInfo
                ? `${authContext.authState.userInfo.image}`
                : ''
            }
            sx={{
              width: 65,
              height: 65,
            }}
            variant="rounded"
          />
          <Box>
            <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
              Welcome, {authContext.authState.userInfo.firstName}{' '}
              {authContext.authState.userInfo.lastName}
            </Typography>
            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
              {authContext.authState.userInfo.role}
            </Typography>
          </Box>
        </Paper>

        {authContext.authState.userInfo.role === 'admin' && (
          <>
            <Box sx={{ mt: 5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  <Typography variant="h5" color="white">
                    Users
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} xl>
                      <DisplayCount
                        colorBG="secondary.main"
                        title="Landlord Registered"
                        count={landlordCount}
                        icon={<SupervisorAccountIcon sx={{ fontSize: 52 }} />}
                      />
                    </Grid>
                    <Grid item xs={12} xl>
                      <DisplayCount
                        colorBG="primary.main"
                        title="Tenant Registered"
                        count={tenantCount}
                        icon={<PeopleIcon sx={{ fontSize: 52 }} />}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Typography variant="h5">Boarding House</Typography>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} xl>
                      <DisplayCount
                        colorBG="secondary.main"
                        title="Pending Boarding House"
                        count={pendingBHCount}
                        icon={<SupervisorAccountIcon sx={{ fontSize: 52 }} />}
                      />
                    </Grid>
                    <Grid item xs={12} xl>
                      <DisplayCount
                        colorBG="primary.main"
                        title="Approved Boarding House"
                        count={approvedBHCount}
                        icon={<PeopleIcon sx={{ fontSize: 52 }} />}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mt: 5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  <UserRegistered data={allLandlord} type="Landlord" />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <UserRegistered data={allTenant} type="Tenants" />
                </Grid>
              </Grid>
            </Box>
          </>
        )}
        {authContext.authState.userInfo.role === 'landlord' && (
          <>
            <Box sx={{ mt: 5 }}>
              <Typography variant="h5" color="white">
                Tenants
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} xl>
                      <DisplayCount
                        colorBG="primary.main"
                        title="Living"
                        count={roomTenants.length}
                        icon={<PeopleIcon sx={{ fontSize: 52 }} />}
                      />
                    </Grid>
                    <Grid item xs={12} xl>
                      <DisplayCount
                        colorBG="secondary.main"
                        title="Requested To Live"
                        count={roomTenantsToLive.length}
                        icon={<PeopleIcon sx={{ fontSize: 52 }} />}
                      />
                    </Grid>
                    <Grid item xs={12} xl>
                      <DisplayCount
                        colorBG="primary.dark"
                        title="Requested To Leave"
                        count={roomTenantsToLeave.length}
                        icon={<PeopleIcon sx={{ fontSize: 52 }} />}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mt: 5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ReservedChart data={roomTenants} />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <PendingChart data={pendingRToAccept} type="Live" />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <PendingChart data={pendingRToCancel} type="Leave" />
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default Dashboard;
