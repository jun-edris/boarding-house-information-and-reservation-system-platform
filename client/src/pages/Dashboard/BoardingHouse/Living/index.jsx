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
} from '@mui/material';
import { FetchContext } from '../../../../context/FetchContext';
import { AuthContext } from '../../../../context/AuthContext';
import theme from './../../../../constants/theme';
import { ToastContainer } from 'react-toastify';
import ProfileModal from '../../../../components/ProfileModal';

export const pendingReserve = [
  { id: 'status', label: 'Status' },
  { id: 'name', label: 'Name' },
  { id: 'room', label: 'Room' },
  { id: 'dateToLive', label: 'Start of Stay (Date)' },
  { id: 'modeOfLiving', label: 'Mode of Living' },
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
    textTransform: 'capitalize',
  },
}));

const LivingTenant = () => {
  const classes = useStyles();
  const fetchContext = useContext(FetchContext);
  const authContext = useContext(AuthContext);
  const [reservedR, setReservedR] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState({});
  const [profilePopup, setProfilePopup] = useState(false);

  const handleModalClose = () => {
    setProfilePopup(false);
  };

  const reservedReservation = async () => {
    fetchContext.authAxios
      .get(`/reservation/reserved`)
      .then(({ data }) => {
        setReservedR(data.reserved);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    reservedReservation();
    const notifChannel = authContext.pusher.subscribe('notify');
    const reservationChannel = authContext.pusher.subscribe('reservation');

    notifChannel.bind('notify-landlord', (newReq) => {
      reservedReservation();
      // setRecords((records) => [...records, newReq]);
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    notifChannel.bind('notify-tenant', (updateReq) => {
      reservedReservation();
      // setRecords(
      // 	records.map((request) =>
      // 		request._id === updateReq._id ? { ...records, updateReq } : request
      // 	)
      // );
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    reservationChannel.bind('canceled', (updateReq) => {
      reservedReservation();
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
          <Typography variant="h4">Tenants Living</Typography>
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
                {reservedR?.map((pending, index) => {
                  const liveDate = new Date(pending?.dateToLive);
                  return (
                    <TableRow key={pending?._id}>
                      <TableCell className={classes.cell} align="center">
                        <Chip label={pending?.status} color="success" />
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
                        <Button
                          type="button"
                          variant="contained"
                          onClick={() => {
                            setSelectedTenant(pending?.tenant);
                            setProfilePopup(true);
                            // TODO view tenant details
                          }}
                        >
                          View Guest Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
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

export default LivingTenant;
