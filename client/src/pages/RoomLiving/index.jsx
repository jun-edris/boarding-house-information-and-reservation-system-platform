import {
  Alert,
  AlertTitle,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FetchContext } from '../../context/FetchContext';
import { ToastContainer, toast } from 'react-toastify';
import ReviewModal from '../../components/Review/ReviewModal';
import ReactStars from 'react-stars';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RoomLiving = () => {
  const authContext = useContext(AuthContext);
  const fetchContext = useContext(FetchContext);
  const [room, setRoom] = useState({});
  const [reviews, setReviews] = useState([]);
  const [owner, setOwner] = useState({});
  const [reservation, setReservation] = useState({});
  const [dateToLeave, setDateToLeave] = useState(new Date());
  const history = useNavigate();

  const getTenantRoom = async () => {
    fetchContext.authAxios
      .get(`/room/tenant/living`)
      .then(({ data }) => {
        setRoom(data.room);
        setOwner(data.owner);
        setReservation(data.reservation);

        const dateConvert = new Date(data?.reservation?.dateToLeave);
        setDateToLeave(dateConvert);

        getRoomReviews(data.room._id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRoomReviews = async (room) => {
    fetchContext.authAxios
      .get(`/reviews/room/${room}`)
      .then(({ data }) => {
        setReviews(data.reviews);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const notifyLandlordToLeave = async (id) => {
    try {
      const values = { roomId: id, type: 'toLeave' };
      const { data } = await fetchContext.authAxios.post(
        `/notify/landlord`,
        values
      );

      toast.success(data.msg);
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const requestToLeaveRoom = async () => {
    try {
      const { data } = await fetchContext.authAxios.patch(
        `/room/user/leave-request`
      );

      if (data) {
        localStorage.setItem('userInfo', data.user);
        authContext.setAuthState({
          ...authContext.authState,
          userInfo: data.user,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.msg);
    }
  };

  const leaveTheBHRequest = async (roomId, tenantId) => {
    const values = { room: roomId, tenant: tenantId };
    try {
      const { data } = await fetchContext.authAxios.patch(
        `/reservation/leave`,
        values
      );

      toast.success(data.msg);
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getTenantRoom();
    // if (authContext.authState.userInfo.reviewed === false && room) {
    //   setShowModal(true);
    // }
    return () => controller.abort();
  }, [fetchContext.refreshKey]);

  return (
    <div>
      <Box>
        <Container maxWidth="xl">
          <Box pt={5} pb={10}>
            <Box
              mb={3}
              mr="auto"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <IconButton
                aria-label="Go to home"
                onClick={() => {
                  if (authContext.authState.userInfo.noBH === true)
                    return history('/home');
                  if (authContext.authState.userInfo.noBH === false)
                    return history(`/home/living`);
                }}
              >
                <ArrowBackIcon sx={{ color: 'white' }} />
              </IconButton>
              <Button
                variant="contained"
                color="secondary"
                disabled={
                  authContext.authState.userInfo.status === 'requestedToLeave'
                }
                onClick={() => {
                  leaveTheBHRequest(
                    room?._id,
                    authContext.authState.userInfo._id
                  );
                  requestToLeaveRoom();
                  notifyLandlordToLeave(room?._id);
                }}
              >
                {authContext.authState.userInfo.status === 'living'
                  ? 'Request To Cancel Reservation'
                  : authContext.authState.userInfo.status === 'requestedToLeave'
                  ? 'Requested To Leave'
                  : null}
              </Button>
            </Box>
            <Grid container spacing={2} sx={{ marginBottom: 4 }}>
              <Grid item xs={12} sx={{ minHeight: '100%' }}>
                <img
                  src={room?.image}
                  alt={room?.roomName}
                  width="100%"
                  height={650}
                  style={{ borderRadius: 20 }}
                />
                <Box mt={1}>
                  <Grid container spacing={2} alignItems="stretch">
                    <Grid item xs={12} lg={9}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="h5" component="h6">
                                {room?.roomName}
                              </Typography>
                              <Typography variant="body2">
                                {room?.roomType}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="body2" component="p">
                                Tenants Living Including You
                              </Typography>
                              <AvatarGroup max={room?.tenants?.length + 2}>
                                {room?.tenants?.map((tenant) => (
                                  <Avatar
                                    key={tenant?._id}
                                    alt={tenant?.firstName}
                                    src={tenant?.image}
                                  />
                                ))}
                              </AvatarGroup>
                            </Box>
                          </Box>
                          <Box mb={2}>
                            <Alert icon={false} severity="success">
                              <AlertTitle>
                                <Typography variant="overline">
                                  Your reservation is up until:
                                </Typography>
                              </AlertTitle>
                              <Typography>
                                {dateToLeave.toDateString()}
                              </Typography>
                            </Alert>
                          </Box>
                          <Divider />
                        </Box>

                        <Box
                          sx={{
                            marginTop: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              width: '100%',
                              minWidth: '100%',
                              boxSizing: 'border-box',
                              overflow: 'auto',
                            }}
                          >
                            {room?.description}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                      <Paper
                        variant="outlined"
                        sx={{
                          display: 'flex',
                          py: 4,
                          px: 2,
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Avatar
                          src={owner?.image}
                          sx={{
                            width: 150,
                            height: 150,
                          }}
                        />
                        <Typography sx={{ mt: 3 }} variant="subtitle1">
                          {owner?.firstName} {owner?.middleName?.substr(0, 1)}.{' '}
                          {owner?.lastName}
                        </Typography>
                        <Typography variant="body2">Owner</Typography>

                        <Box mt={2}>
                          <Typography variant="body1" align="center">
                            Phone: 0{owner?.contact}
                          </Typography>
                          <Typography variant="body1" align="center">
                            Email: {owner?.email}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            <Box mt={2} mb={2}>
              <Alert severity="info" sx={{ width: '100%' }}>
                <AlertTitle>Landmark where you can pay your rent.</AlertTitle>
                {room?.boardingHouse?.landmark}
              </Alert>
            </Box>
            <Divider />
            <Box mt={4} mb={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h6">
                  Room feedback from the tenants
                </Typography>
                <Box>
                  {reviews?.map((review) => (
                    <Box key={review?._id}>
                      <Box
                        mt={4}
                        pb={2}
                        sx={{
                          display: 'flex',
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Avatar src={review?.tenant?.image} />
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {review?.tenant?.firstName}{' '}
                            {review?.tenant?.lastName.substr(0, 1)}.
                          </Typography>
                          <ReactStars
                            count={5}
                            value={review?.rating}
                            edit={false}
                            size={16}
                            color2="#ffd700"
                          />
                          <Typography variant="body2" sx={{ marginTop: 2 }}>
                            {review?.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
      <ReviewModal room={room?._id} boardingHouse={room?.boardingHouse?._id} />
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
    </div>
  );
};

export default RoomLiving;
