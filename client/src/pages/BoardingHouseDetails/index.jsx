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
import UserAgreement from '../../components/UserAgreement';

const BoardingHouseDetails = () => {
  const { id } = useParams();
  const history = useNavigate();
  const fetchContext = useContext(FetchContext);
  const authContext = useContext(AuthContext);
  const [bHouse, setBHouse] = useState({});
  const [selectedMenu, setSelectedMenu] = useState('');
  const [openAgreementPopup, setOpenAgreementPopup] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [room, setRoom] = useState({});

  const handleModalClose = () => {
    setOpenPopup(false);
  };

  const handleModalAgreementClose = () => {
    setOpenAgreementPopup(false);
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

    const reserveChannel = authContext.pusher.subscribe('reserve');

    reserveChannel.bind('reserve', (res) => {
      getApprovedBH();
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
      <div>
        <Box>
          <Box
            sx={{
              background: `url(/logo.png)`,
              height: 500,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 1,
              },
            }}
          ></Box>
          <Container
            maxWidth="xl"
            sx={{ mt: '-420px', zIndex: 2, position: 'relative', pb: 10 }}
          >
            <Box pt={5}>
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
                    if (authContext.authState.userInfo.noBH === true)
                      return history('/home');
                    if (authContext.authState.userInfo.noBH === false)
                      return history(`/home/living`);
                  }}
                >
                  <ArrowBackIcon sx={{ color: 'white' }} />
                </IconButton>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {/* {authContext.authState.userInfo.noBH && (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      disabled={
                        authContext.authState.userInfo.status ===
                          'requestedToReserve' ||
                        authContext.authState.userInfo.status === 'living'
                          ? true
                          : false
                      }
                      onClick={() => {
                        setOpenAgreementPopup(true);
                        // setOpenPopup(true);
                        // setSelectedMenu('Reserve A Room');
                      }}
                    >
                      {authContext.authState.userInfo.status ===
                      'requestedToReserve'
                        ? 'Already Requested To Reserve!'
                        : authContext.authState.userInfo.status === 'living'
                        ? 'Already Living'
                        : 'Reserve a room'}
                    </Button>
                  )} */}
                  {authContext.authState.userInfo.noBH &&
                    authContext.authState.userInfo.status ===
                      'requestedToReserve' && (
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
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
                  <Grid
                    container
                    spacing={2}
                    sx={{ height: '650', position: 'relative', width: '100%' }}
                  >
                    <Grid item xs={12} lg={5}>
                      <img
                        src={bHouse?.image}
                        alt={bHouse?.houseName}
                        width="100%"
                        height="100%"
                      />
                    </Grid>
                    <Grid item xs={12} lg={7} sx={{ height: '100%' }}>
                      <Grid container spacing={2}>
                        {bHouse?.rooms
                          ?.filter((element, index) => {
                            return index < 6;
                          })
                          .map((room, index) => {
                            return (
                              <Grid item key={index} xs={12} md={6} lg={4}>
                                <Card>
                                  {room?.image ? (
                                    <CardMedia
                                      component="img"
                                      width="100%"
                                      height="220"
                                      image={room?.image}
                                      alt={bHouse?.houseName}
                                    />
                                  ) : (
                                    <Box height="100%" width="100%">
                                      <Typography variant="body2">
                                        No image
                                      </Typography>
                                    </Box>
                                  )}
                                </Card>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Box mt={1}>
                    <Grid
                      container
                      spacing={2}
                      alignItems="stretch"
                      justifyContent="flex-start"
                    >
                      <Grid item xs={12} lg={9}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
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
                            height: '100%',
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
                          <Box mt={2}>
                            <Alert severity="info" sx={{ height: '100%' }}>
                              <AlertTitle>
                                Address where you can pay your rent.
                              </AlertTitle>
                              {bHouse?.landmark}
                            </Alert>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              <Divider />
              <Paper variant="outlined" sx={{ p: 3, marginTop: 4 }}>
                <Typography variant="h4" sx={{ marginBottom: 3 }}>
                  Rooms
                </Typography>
                <Grid container spacing={2}>
                  {bHouse?.rooms?.map((room, index) => {
                    return (
                      <Grid item xs={12} md={6} lg={3} key={index}>
                        <Card
                          sx={{
                            height: '100%',
                            cursor:
                              room.tenants.length === room.allowedTenants ||
                              !authContext.authState.userInfo.noBH
                                ? 'default'
                                : 'pointer', // cursor is set to default if tenants are fully rented
                          }}
                          onClick={() => {
                            if (
                              room.tenants.length !== room.allowedTenants &&
                              authContext.authState.userInfo.noBH
                            ) {
                              setOpenAgreementPopup(true);
                              setRoom(room);
                            }

                            // if (
                            //   room.tenants.length !== room.allowedTenants &&
                            //   authContext.authState.userInfo.noBH === false
                            // ) {
                            // }
                          }}
                        >
                          <CardMedia
                            sx={{ height: 200 }}
                            image={room.image}
                            title={room.type}
                          />
                          <CardContent>
                            <Box mb={1}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  width: '100%',
                                }}
                              >
                                <Box>
                                  <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="h6"
                                    sx={{ textTransform: 'capitalize' }}
                                  >
                                    {room?.roomName}
                                  </Typography>
                                  <Typography
                                    gutterBottom
                                    variant="caption"
                                    component="span"
                                    sx={{ textTransform: 'capitalize' }}
                                  >
                                    {room?.roomType}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Chip
                                    label={
                                      room?.tenants.length > 0 &&
                                      room?.tenants.length !==
                                        room?.allowedTenants
                                        ? 'Rented By Tenants'
                                        : room?.tenants.length ===
                                          room?.allowedTenants
                                        ? 'Fully Rented'
                                        : 'Vacant'
                                    }
                                    size="small"
                                    color={
                                      room?.tenants.length > 0 &&
                                      room?.tenants.length !==
                                        room?.allowedTenants
                                        ? 'warning'
                                        : room?.tenants.length ===
                                          room?.allowedTenants
                                        ? 'error'
                                        : 'success'
                                    }
                                  />
                                </Box>
                              </Box>
                            </Box>
                            <Box my={2}>
                              <Typography
                                variant="body1"
                                component="pre"
                                sx={{
                                  whiteSpace: 'pre-wrap',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {room.description}
                              </Typography>
                            </Box>
                            <Alert
                              severity="info"
                              variant="outlined"
                              icon={false}
                              sx={{ width: '100%' }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 2,
                                  width: '100%',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Allowed Tenants:{' '}
                                    <strong>{room.allowedTenants}</strong>
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Price: <strong>₱{room.prize}</strong>
                                  </Typography>
                                </Box>
                              </Box>
                            </Alert>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Box>
            <Divider />
            <Box mt={4} mb={4}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h5" component="h6" sx={{ mb: 3 }}>
                  Boarding house feedback from the tenants
                </Typography>
                <Box sx={{ overflowY: 'scroll', height: 350, pr: 3 }}>
                  {reviews?.map((review) => (
                    <Box key={review?._id}>
                      <Box
                        pb={2}
                        sx={{
                          display: 'flex',
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Avatar src={review?.tenant?.image} />
                        </Box>
                        <Box
                          sx={{
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                              justifyContent: 'space-between',
                              width: '100%',
                            }}
                          >
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
                              size={20}
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
                          <Box
                            sx={{
                              mt: 1,
                              backgroundColor: '#eeeeee',
                              borderRadius: 1,
                              py: 3,
                              px: 3,
                            }}
                          >
                            <Typography variant="body2">
                              {review?.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Container>
        </Box>
        <DialogContainer
          title="User Agreement"
          open={openAgreementPopup}
          scroll="scroll"
          onClose={handleModalAgreementClose}
          openPopup={openPopup}
          setSelectedMenu={setSelectedMenu}
          setOpenPopup={setOpenPopup}
          nextPopupTitle="Reserve A Room"
        >
          <UserAgreement>
            <Box>
              <Typography variant="h4" align="center">
                Conditions and terms
              </Typography>
              <Typography
                variant="h4"
                align="center"
                sx={{ fontStyle: 'italic' }}
              >
                (Boarding House Owner & Tenant)
              </Typography>
              <Typography variant="h4" align="center" sx={{ mt: 4 }}>
                BOARDING HOUSE INFORMATION AND RESERVATION SYSTEM PLATFORM
                AGREEMENT
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">GENERAL RULES:</Typography>
              <ol>
                <li>Tenant should pay 50% advance before occupying a room.</li>
                <li>
                  If the tenant does not pursue reserving the room, the money
                  (downpayment) cannot be refunded.
                </li>
                <li>
                  Tenants should not bring any pets to the boarding house.
                </li>
                <li>
                  Smoking inside the boarding house is strictly prohibited.
                </li>
                <li>
                  Boys are not permitted to enter the girls' room, and girls are
                  not permitted to enter the boys' room.
                </li>
                <li>Dating inside the boarding house room is not allowed.</li>
                <li>Avoid disturbing others. Respect is a must.</li>
              </ol>
            </Box>
            <Typography variant="h4">BOARDING HOUSE RULES:</Typography>
            <Box my={3}>
              <Typography variant="h5">WITHIN THE PREMISES:</Typography>
              <ul>
                <li>No smoking, naked flames, or burning candles inside.</li>
                <li>
                  Visitors are allowed but only entertain in the common area.
                </li>
                <li>No overnight stay for visitors.</li>
                <li>Observed QUITE TIME starting at 9:00 P.M.</li>
                <li>Turn OFF the light when not in use.</li>
                <li>Respect everyone.</li>
              </ul>
            </Box>
            <Box my={3}>
              <Typography variant="h5">CLEANLINESS:</Typography>
              <ul>
                <li>
                  Maintain a clean environment inside and outside your rooms.
                </li>
                <li>
                  Please, wipe the dining table dry after use. If needed please
                  sweep the floor for any fallen food crumbs.
                </li>
                <li>
                  Please throw your garbage at the garbage bin and bring it
                  downstairs at the end of the week.
                </li>
                <li>Please make sure the toilet is clean after use.</li>
                <li>No shoes allowed inside the house.</li>
                <li>
                  Practice <strong>CLAYGO</strong>. Clean As You Go. Your fellow
                  boarders/tenant are not your personal house cleaners.
                </li>
              </ul>
            </Box>
            <Box my={3}>
              <Typography variant="h5">WATER AND ELECTRICITY:</Typography>
              <ul>
                <li>Please, make sure to turn off the faucet after use.</li>
                <li>Please, switch off lights when not in use.</li>
                <li>
                  Please unplug your chargers when not in use and before going
                  to bed. NO OVERNIGHT CHARGING, as this may cause overheating
                  and possibly a fire.
                </li>
                <li>
                  Each room is limited to one rice cooker; additional rice
                  cookers are subject to a fee.
                </li>
                <li>Please, make sure to turn off the Gas stove after use. </li>
              </ul>
            </Box>
            <Box my={3}>
              <Typography variant="h5">CURFEW:</Typography>
              <ul>
                <li>From 9:30 P.M. to 5 A.M.</li>
                <li>
                  Gate will be closed after 15 minutes to the curfew hours.
                </li>
              </ul>
            </Box>
            <Box my={3}>
              <Typography variant="h5" align="center">
                NOTE:
              </Typography>
            </Box>
            <Box my={3}>
              <Typography
                variant="h5"
                sx={{ fontStyle: 'italic' }}
                align="center"
              >
                RULES OF THE BOARDING HOUSE MIGHT BE CHANGED ACCORDING TO THE
                BOARDING HOUSE OWNER.
              </Typography>
            </Box>
            <Box my={10}>
              <Typography variant="h4" align="center">
                OUTLINE OF THE BOARDING HOUSE INFORMATION AND RESERVATION SYSTEM
                PLATFORM AGREEMENT
              </Typography>
            </Box>
            <Box my={3}>
              <ol>
                <li>Agreement</li>
              </ol>
              <ul>
                <li>This agreement is for all users.</li>
                <li>
                  Changes to any payment or rules must be notified directly.
                </li>
              </ul>
              <ol start={2}>
                <li>Rent</li>
              </ol>
              <ul>
                <li>Receipt must be provided if the tenant paid already.</li>
              </ul>
              <ol start={3}>
                <li>Boarding house owner responsibilities</li>
              </ol>
              <ul>
                <li>Provide a room in a reasonable state of cleanliness.</li>
                <li>
                  Provide and maintain the boarding house in a reasonable state
                  of repair and comply with all building, health, and safety
                  requirements that apply to the premises.
                </li>
                <li>Allow the tenant quiet enjoyment of the room.</li>
                <li>
                  Ensure the tenant has access to the room, toilet, and bathroom
                  facilities at all times and to other facilities at all
                  reasonable hours.
                </li>
                <li>
                  Ensure the house rules and fire evacuation procedures are on
                  display in the boarding house at all times.
                </li>
                <li>
                  Enforce the house rules in a fair and consistent manner.
                </li>
              </ul>
              <ol start={4}>
                <li>Tenant’s responsibilities</li>
              </ol>
              <ul>
                <li>Pay the rent on time.</li>
                <li>
                  Keep the boarding room reasonably clean and tidy, and notify
                  the landlady or landlord as soon as any repairs are needed
                </li>
              </ul>
            </Box>
          </UserAgreement>
        </DialogContainer>
        {/* <DialogContainer
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
                  label={
                    room?.tenants?.length === room?.allowedTenants
                      ? 'Fully Booked'
                      : room?.tenants.length > 0 ||
                        room?.tenants.length !== room?.allowedTenants
                      ? 'Partially Booked'
                      : 'Available'
                  }
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
        </DialogContainer> */}
        <DialogContainer
          title={selectedMenu}
          open={openPopup}
          cusWid="md"
          onClose={handleModalClose}
        >
          <ReserveForm
            rooms={bHouse?.rooms?.filter(
              (room) => room?.allowedTenants !== room?.tenants?.length
            )}
            selectedRoom={room}
            open={openPopup}
            onClose={handleModalClose}
          />
        </DialogContainer>
      </div>
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

export default BoardingHouseDetails;
