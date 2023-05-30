import { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import CheckIcon from '@mui/icons-material/Check';
import { FetchContext } from '../../../../context/FetchContext';
import { AuthContext } from '../../../../context/AuthContext';
import theme from './../../../../constants/theme';
import { ToastContainer, toast } from 'react-toastify';
import ReasonForm from '../../../../components/Reason/ReasonForm';
import ProfileModal from '../../../../components/ProfileModal';

export const pendingReserve = [
  { id: 'status', label: 'Status' },
  { id: 'name', label: 'Name' },
  { id: 'room', label: 'Room' },
  { id: 'dateToLive', label: 'Start of Stay (Date)' },
  { id: 'mode', label: 'Mode of Living' },
  { id: 'action', label: 'Action' },
];

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 650,
  },
  headerCell: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  cell: {
    color: theme.palette.text.primary,
  },
}));

const PendingReservation = () => {
  const classes = useStyles();
  const fetchContext = useContext(FetchContext);
  const authContext = useContext(AuthContext);
  const [pendingRToAccept, setPendingRToAccept] = useState([]);
  const [pendingRToCancel, setPendingRToCancel] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState({});
  const [profilePopup, setProfilePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reasonPopup, setReasonPopup] = useState(false);

  const [decline, setDecline] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [tenantId, setTenantId] = useState('');

  const handleModalClose = () => {
    setReasonPopup(false);
    setProfilePopup(false);
  };

  const pendingReservationToAccept = async () => {
    fetchContext.authAxios
      .get(`/reservation/pending-to-accept`)
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

  const acceptReservation = async (reservationId, tenantId, roomId) => {
    try {
      const values = { tenantID: tenantId, roomId: roomId };
      const { data, status } = await fetchContext.authAxios.patch(
        `/reservation/accept/${reservationId}`,
        values
      );

      if (status === 200) toast.success(data.msg);
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const acceptLeaveBH = async (reservationId, tenantId, roomId) => {
    try {
      const values = { tenantID: tenantId, roomId };

      const { data, status } = await fetchContext.authAxios.patch(
        `/reservation/accept-leave/${reservationId}`,
        values
      );

      if (status === 200) toast.success(data.msg);
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  // const declineLeaveBH = async (reservationId, tenantId) => {
  //   try {
  //     const values = { tenantID: tenantId };
  //     const { data } = await fetchContext.authAxios.patch(
  //       `/reservation/leave/${reservationId}`,
  //       values
  //     );

  //     if (data) {
  //       toast.success(data.msg);
  //       return true;
  //     }
  //   } catch (error) {
  //     toast.error(error?.msg);
  //   }
  // };

  const deleteNotifLandlord = async (tenantId) => {
    try {
      const { data } = await fetchContext.authAxios.delete(
        `/notify/delete/landlord/${tenantId}`
      );

      if (data) {
        return true;
      }
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const notifyTenant = async (tenantId, type) => {
    try {
      const values = { tenantId: tenantId, type: type, reason: '' };
      const { data } = await fetchContext.authAxios.post(
        `/notify/tenant`,
        values
      );

      toast.success(data.msg);
      setLoading(false);
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    pendingReservationToAccept();
    pendingReservationToCancel();
    const notifChannel = authContext.pusher.subscribe('notify');
    const reservationChannel = authContext.pusher.subscribe('reservation');

    notifChannel.bind('notify-landlord', (newReq) => {
      pendingReservationToAccept();
      pendingReservationToCancel();
      // setRecords((records) => [...records, newReq]);
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    notifChannel.bind('notify-tenant', (updateReq) => {
      pendingReservationToAccept();
      pendingReservationToCancel();
      // setRecords(
      // 	records.map((request) =>
      // 		request._id === updateReq._id ? { ...records, updateReq } : request
      // 	)
      // );
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    reservationChannel.bind('canceled', (updateReq) => {
      pendingReservationToAccept();
      pendingReservationToCancel();
      // setRecords(
      // 	records.map((request) =>
      // 		request._id === updateReq._id ? { ...records, updateReq } : request
      // 	)
      // );
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    reservationChannel.bind('toLeave', (updateReq) => {
      pendingReservationToAccept();
      pendingReservationToCancel();
      // setRecords(
      // 	records.map((request) =>
      // 		request._id === updateReq._id ? { ...records, updateReq } : request
      // 	)
      // );
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    return () => controller.abort();
  }, [fetchContext.refreshKey]);
  return (
    <>
      <Box>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4">Reservation Request To Accept</Typography>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {pendingReserve?.map((req, index) => (
                    <TableCell
                      className={classes.headerCell}
                      key={req.id}
                      align="center"
                      sx={{ color: 'white' }}
                    >
                      {req.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRToAccept?.map((pending, index) => {
                  const statusR =
                    pending?.status === 'pendingToAccept' &&
                    'Pending to Accept';

                  const liveDate = new Date(pending?.dateToLive);
                  return (
                    <TableRow key={pending?._id}>
                      <TableCell className={classes.cell} align="center">
                        <Chip label={statusR} color="warning" />
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        {pending?.tenant?.firstName} {pending?.tenant?.lastName}
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        {pending?.room?.roomName}
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        {liveDate.toDateString()}
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        {pending.modeOfLiving}
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Button
                              type="button"
                              variant="contained"
                              startIcon={
                                loading ? <CircularProgress /> : <CheckIcon />
                              }
                              disabled={loading}
                              onClick={() => {
                                setLoading(true);
                                const accepted = acceptReservation(
                                  pending?._id,
                                  pending?.tenant?._id,
                                  pending?.room?._id
                                );
                                if (accepted) {
                                  notifyTenant(
                                    pending?.tenant?._id,
                                    'acceptReservation'
                                  );
                                  deleteNotifLandlord(pending?.tenant?._id);
                                }
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              color="error"
                              variant="outlined"
                              startIcon={
                                loading ? (
                                  <CircularProgress />
                                ) : (
                                  <DoNotDisturbIcon />
                                )
                              }
                              disabled={loading}
                              onClick={() => {
                                // setLoading(true);
                                setReasonPopup(true);
                                setDecline('declineReservation');
                                setReservationId(pending?._id);
                                setTenantId(pending?.tenant?._id);
                              }}
                            >
                              Decline
                            </Button>
                          </Box>
                        </Box>
                        <Box>
                          <Button
                            type="button"
                            variant="contained"
                            onClick={() => {
                              setSelectedTenant(pending?.tenant);
                              setProfilePopup(true);
                            }}
                          >
                            View Guest Details
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Box mt={10}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4">Reservation Request To Cancel</Typography>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {pendingReserve?.map((req, index) => (
                    <TableCell
                      className={classes.headerCell}
                      key={req.id}
                      align="center"
                      sx={{ color: 'white' }}
                    >
                      {req.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRToCancel?.map((pending, index) => {
                  const statusR =
                    pending?.status === 'pendingToLeave' && 'Pending to Cancel';

                  const liveDate = new Date(pending?.dateToLive);
                  return (
                    <TableRow key={pending?._id}>
                      <TableCell className={classes.cell} align="center">
                        <Chip label={statusR} color="warning" />
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        {pending?.tenant?.firstName} {pending?.tenant?.lastName}
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        {pending?.room?.roomName}
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        {liveDate.toDateString()}
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        {pending.modeOfLiving}
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Button
                              type="button"
                              variant="contained"
                              startIcon={
                                loading ? <CircularProgress /> : <CheckIcon />
                              }
                              disabled={loading}
                              onClick={() => {
                                setLoading(true);
                                const accepted = acceptLeaveBH(
                                  pending?._id,
                                  pending?.tenant?._id,
                                  pending?.room?._id
                                );

                                if (accepted) {
                                  notifyTenant(
                                    pending?.tenant?._id,
                                    'acceptCancelation'
                                  );
                                  deleteNotifLandlord(pending?.tenant?._id);
                                }
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              color="error"
                              variant="outlined"
                              onClick={() => {
                                setReasonPopup(true);
                                setDecline('declineLeaveBH');
                                setReservationId(pending?._id);
                                setTenantId(pending?.tenant?._id);
                              }}
                            >
                              Decline
                            </Button>
                          </Box>
                        </Box>
                        <Box>
                          <Button
                            type="button"
                            variant="contained"
                            onClick={() => {
                              setSelectedTenant(pending?.tenant);
                              setProfilePopup(true);
                            }}
                          >
                            View Guest Details
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <ReasonForm
        open={reasonPopup}
        closeModal={handleModalClose}
        decline={decline}
        reservationId={reservationId}
        tenantId={tenantId}
      />
      <ProfileModal
        open={profilePopup}
        closeModal={handleModalClose}
        user={selectedTenant}
      />
      <ToastContainer
        position="top-right"
        autoClose={100}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </>
  );
};

export default PendingReservation;
