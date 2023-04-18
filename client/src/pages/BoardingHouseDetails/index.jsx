import React, { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../context/FetchContext';
import { useNavigate, useParams } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import DialogContainer from '../../components/common/DialogContainer';
import ReserveForm from '../../components/ReserveForm';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import ReactStars from 'react-stars';

const BoardingHouseDetails = () => {
  const { id } = useParams();
  const history = useNavigate();
  const fetchContext = useContext(FetchContext);
  const authContext = useContext(AuthContext);
  const [bHouse, setBHouse] = useState({});
  const [selectedMenu, setSelectedMenu] = useState('');
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [room, setRoom] = useState({} || null);
  const [openPopup, setOpenPopup] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleModalClose = () => {
    setShowRoomDetails(false);
    setOpenPopup(false);
  };

  const getApprovedBH = async () => {
    fetchContext.authAxios
      .get(`/boardinghouse/approved/${id}`)
      .then(({ data }) => {
        setBHouse(data);

        getBoardingHouseReviews(data._id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cancelRequestRoom = async () => {
    try {
      const { data } = await fetchContext.authAxios.patch(
        `/reservation/cancel-request`
      );

      if (data) {
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        authContext.setAuthState({
          ...authContext.authState,
          userInfo: data.user,
        });
      }
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const cancelReservation = async () => {
    try {
      const { data } = await fetchContext.authAxios.delete(
        `/reservation/cancel/${authContext.authState.userInfo.room}`
      );

      // existingInfo['status'] = 'requested';
      toast.success(data.msg);
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const getBoardingHouseReviews = async (boardingHouse) => {
    fetchContext.authAxios
      .get(`/reviews/boardingHouse/${boardingHouse}`)
      .then(({ data }) => {
        setReviews(data.reviews);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    getApprovedBH();

    return () => controller.abort();
  }, [fetchContext.refreshKey]);

  return (
    <>
      <div>
        <Box>
          <Container maxWidth="xl">
            <Box pt={5} pb={10}>
              <Box
                mb={3}
                mr="auto"
                sx={{
                  display: 'flex',
                  justifyContent: authContext.authState.userInfo.noBH
                    ? 'space-between'
                    : 'flex-start',
                }}
              >
                <IconButton
                  aria-label="Go to home"
                  onClick={() => {
                    history('/home');
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {authContext.authState.userInfo.noBH && (
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={
                        authContext.authState.userInfo.status ===
                          'requestedToReserve' ||
                        authContext.authState.userInfo.status === 'living'
                          ? true
                          : false
                      }
                      onClick={() => {
                        setOpenPopup(true);
                        setSelectedMenu('Reserve A Room');
                      }}
                    >
                      {authContext.authState.userInfo.status ===
                      'requestedToReserve'
                        ? 'Already Requested To Reserve!'
                        : authContext.authState.userInfo.status === 'living'
                        ? 'Already Living'
                        : 'Reserve a room'}
                    </Button>
                  )}
                  {authContext.authState.userInfo.noBH &&
                    authContext.authState.userInfo.status ===
                      'requestedToReserve' && (
                      <Button
                        variant="contained"
                        color="error"
                        disabled={
                          authContext.authState.userInfo.status === ''
                            ? true
                            : false
                        }
                        onClick={() => {
                          if (
                            authContext.authState.userInfo.status ===
                            'requestedToReserve'
                          ) {
                            cancelRequestRoom();
                            cancelReservation();
                          }
                        }}
                      >
                        {authContext.authState.userInfo.status ===
                          'requestedToReserve' && 'Cancel Request'}
                      </Button>
                    )}
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                <Grid item xs={12}>
                  <img
                    src={bHouse?.image}
                    alt={bHouse?.houseName}
                    width="100%"
                    height={650}
                    style={{ borderRadius: 20 }}
                  />
                  <Box mt={1}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={9}>
                        <Typography variant="h5" component="h6">
                          {bHouse?.houseName}
                        </Typography>
                        <Box
                          mt={1}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <LocationOnIcon color="disabled" />
                          <Typography variant="body2">
                            {bHouse?.owner?.barangay} {bHouse?.owner?.city}{' '}
                            {bHouse?.owner?.province} {bHouse?.owner?.region}
                          </Typography>
                        </Box>
                        <Box mt={2}>
                          <Typography
                            sx={{
                              boxSizing: 'border-box',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {bHouse?.description}
                          </Typography>
                        </Box>
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
                            src={bHouse?.owner?.image}
                            sx={{
                              width: 150,
                              height: 150,
                            }}
                          />
                          <Typography sx={{ mt: 3 }} variant="subtitle1">
                            {bHouse?.owner?.firstName}{' '}
                            {bHouse?.owner?.middleName.substr(0, 1)}.{' '}
                            {bHouse?.owner?.lastName}
                          </Typography>
                          <Typography variant="body2">Owner</Typography>

                          <Box mt={2}>
                            <Typography variant="body1">
                              Phone: 0{bHouse?.owner?.contact}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                    <Box mt={2}>
                      <Alert severity="info">
                        <AlertTitle>
                          Landmark where you can pay your rent.
                        </AlertTitle>
                        {bHouse?.landmark}
                      </Alert>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider />
              <Typography sx={{ marginTop: 4, marginBottom: 3 }} variant="h6">
                Rooms Available
              </Typography>
              <Grid container spacing={2}>
                {bHouse?.rooms?.map((room, index) => {
                  return (
                    <Grid item key={index} xs={12} md={3} lg={3}>
                      <Card
                        sx={{
                          boxShadow: 'none',
                          '&:hover': {
                            cursor: 'pointer',
                          },
                        }}
                        onClick={() => {
                          setRoom(room);
                          setSelectedMenu('Room Details');
                          setShowRoomDetails(true);
                        }}
                      >
                        {room?.image ? (
                          <CardMedia
                            component="img"
                            height="270"
                            width="350"
                            image={room?.image}
                            alt={bHouse?.houseName}
                            sx={{
                              borderRadius: '7%',
                            }}
                          />
                        ) : (
                          <Box height={270} width={350}>
                            <Typography variant="body2">No image</Typography>
                          </Box>
                        )}
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
            <Divider />
            <Box mt={4} mb={4}>
              <Typography variant="h5" component="h6">
                Boarding house feedback from the tenants
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
                        <Box sx={{ display: 'flex', gap: 2 }}>
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
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'grey.500',
                            textTransform: 'uppercase',
                          }}
                        >
                          {review?.room?.roomName}
                        </Typography>
                        <Typography variant="body2" sx={{ marginTop: 2 }}>
                          {review?.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider />
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>
        <DialogContainer
          title={selectedMenu}
          open={showRoomDetails}
          onClose={handleModalClose}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
              <img
                src={room?.image}
                width="100%"
                alt={bHouse?.houseName}
                style={{ marginBottom: '20px' }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: 3,
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
                    {room?.roomName}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {room?.roomType}
                  </Typography>
                </Box>

                <Chip
                  label={room?.available ? 'Available' : 'Occupied'}
                  color={room?.available ? 'success' : 'info'}
                />
              </Box>
              <Typography>Allowed Tenants: {room?.allowedTenants}</Typography>
              <Typography>Prize: ₱{room?.prize}</Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 2,
                }}
              >
                Room Description:
              </Typography>
              <Typography
                component="pre"
                sx={{
                  whiteSpace: 'pre-wrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {room?.description}
              </Typography>
            </Grid>
          </Grid>
        </DialogContainer>
        <DialogContainer
          title={selectedMenu}
          open={openPopup}
          onClose={handleModalClose}
        >
          <ReserveForm rooms={bHouse?.rooms} onClose={handleModalClose} />
        </DialogContainer>
      </div>
      <ToastContainer theme="colored" />
    </>
  );
};

export default BoardingHouseDetails;
