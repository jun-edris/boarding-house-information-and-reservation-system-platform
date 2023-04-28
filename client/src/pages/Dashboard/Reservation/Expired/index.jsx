import { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import {
  Box,
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

export const pendingReserve = [
  { id: 'status', label: 'Status' },
  { id: 'name', label: 'Name' },
  { id: 'room', label: 'Room' },
  { id: 'dateToLive', label: 'Date to Live' },
  { id: 'dateToLeave', label: 'Date to Leave' },
];

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 650,
  },
  headerCell: {
    backgroundColor: theme.palette.primary.main,
  },
  cell: {
    color: theme.palette.text.primary,
  },
}));

const ExpiredReservation = () => {
  const classes = useStyles();
  const fetchContext = useContext(FetchContext);
  const authContext = useContext(AuthContext);
  const [expiredR, setExpiredR] = useState([]);

  const expiredReservation = async () => {
    fetchContext.authAxios
      .get(`/reservation/expired`)
      .then(({ data }) => {
        setExpiredR(data.expired);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    expiredReservation();
    const notifChannel = authContext.pusher.subscribe('notify');
    const reservationChannel = authContext.pusher.subscribe('reservation');

    notifChannel.bind('notify-landlord', (newReq) => {
      expiredReservation();
      // setRecords((records) => [...records, newReq]);
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    notifChannel.bind('notify-tenant', (updateReq) => {
      expiredReservation();
      // setRecords(
      // 	records.map((request) =>
      // 		request._id === updateReq._id ? { ...records, updateReq } : request
      // 	)
      // );
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    reservationChannel.bind('canceled', (updateReq) => {
      expiredReservation();
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
          <Typography variant="h4">Expired Reservation</Typography>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {pendingReserve?.map((req, index) => (
                    <TableCell
                      className={classes.headerCell}
                      key={req.id}
                      align="center"
                    >
                      {req.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {expiredR?.map((pending, index) => {
                  const liveDate = new Date(pending?.dateToLive);
                  const leaveDate = new Date(pending?.dateToLeave);
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
                        {leaveDate.toDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <ToastContainer theme="colored" />
    </>
  );
};

export default ExpiredReservation;
