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
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [room, setRoom] = useState({} || null);
  const [openPopup, setOpenPopup] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleModalClose = () => {
    setShowRoomDetails(false);
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
                    <Grid container spacing={2} alignItems="stretch">
                      <Grid item xs={12} lg={9}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
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
              <Paper variant="outlined" sx={{ p: 3, marginTop: 4 }}>
                <Typography variant="h4" sx={{ marginBottom: 3 }}>
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
              </Paper>
            </Box>
            <Divider />
            <Box mt={4} mb={4}>
              <Paper variant="outlined" sx={{ p: 3 }}>
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
                CONDITIONS
              </Typography>
              <Typography variant="h4" align="center">
                (TENANT & BOARDING HOUSE OWNER)
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">1. Scope</Typography>
              <Typography sx={{ marginTop: 2 }}>
                The legal relationship between the tenant and the boarding house
                owner is governed by these terms and conditions. You accept
                legal responsibility and acknowledge the content of these terms
                by confirming your reservation.
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">
                2. Request for Reservation or Contract
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                2.1 By submitting your request, you agree to a legally binding
                contract. You can make your reservation in writing, orally, or
                over the phone. Your request is not yet acceptable, but it
                entitles you to enter into a contract with the boarding house
                owner.
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                2.2 The contract between you and the landlord is only formed
                when the Boarding House System Information and Reservation
                Platform Admin confirms your booking request in writing or by
                e-mail and you accept the terms and conditions
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">3. Prices and Services</Typography>
              <Typography sx={{ marginTop: 2 }}>
                3.1 The scope of the contractual services and the resulting
                prices are derived from the offer's terms of reference and the
                information in the reservation confirmation. The rate includes
                the costs of electricity, water, heating, and cleaning.
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                3.2 The agreed-upon prices include any applicable VAT.
                Specifications will be made in the confirmation of the
                reservation if there are discrepancies between the information
                in the offer and the information in the booking confirmation.
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                3.3 The contract is final and will not be modified as a
                consequence of late arrival and/or early departure due to
                illness or other reasons; the responsibility will not be assumed
                by the landlord or Boarding House System Information and
                Reservation Platform Admin for the reasons stated previously,
                and you will not be entitled to a proportional refund.
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">4. Payment</Typography>
              <Typography sx={{ marginTop: 2 }}>
                4.1 The total amount of your stay must be paid in full or by
                credit card at the time of check-in.
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">
                5. Cancellation by the tenant and the cost of cancellation
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                5.1 You have the right to cancel your reservation at any time.
                We recommend that the decision to withdraw be made in writing
                for reasons of proof. In the event of withdrawal, we have the
                right to seek reimbursement from you for our expenses.
              </Typography>
              <Box sx={{ marginTop: 2 }}>
                <Typography>
                  5.2 If the reservation is canceled, the following cancellation
                  fees will be assessed:
                </Typography>
                <Typography sx={{ pl: 5, marginTop: 2 }}>
                  a. According to the concluded contract, free cancellation of
                  the reservation before the start of the schedule period
                  (planned arrival) is possible for reservations up to 1 week
                  per room.
                </Typography>
              </Box>
              <Typography sx={{ marginTop: 2 }}>
                5.3 The calculation is based on the agreed-upon total price. The
                receipt of your resignation from us is decisive for the
                staggering. The proof of a lesser failure is still with you.
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">
                6. Subletting/tenant replacement
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                6.1 It is prohibited to sublet or re-let the rented object, as
                well as to use it for purposes other than accommodations.
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">
                6. Withdrawal from the landlord
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                7.1 If an advance payment has been agreed upon;
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                A. If the required payment following a lapse is not made within
                the grace period allowed by the Boarding House System
                Information and Reservation Platform Admin, the lessor has the
                right to withdraw from the entitled contract.
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">
                8. Accommodation/Taking Over/Return
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                8.1 Keys are distributed upon arrival, either personally or
                through an automated key dispenser system. More information is
                available directly from the Boarding House System Information
                and Reservation Platform Admin.
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">
                9. Asset/Obligation to Cooperate/Warranty/Claim Exclusion
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                9.1 As a tenant of the property, you and any co-users agree to
                take care of the property and its associated inventory. You are
                responsible for any missing or damaged items as well as
                inventory. Boarding House System Information and Reservation
                Platform Admin reserves all rights.
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">10. Miscellaneous</Typography>
              <Typography sx={{ marginTop: 2 }}>
                10.1 Noise Pollution: Avoid disturbing your neighbors. Please
                allow for normal and appropriate background noise, such as that
                produced by construction workers. We are not liable for any
                extra noise caused by road works or other activities outside the
                building's boundaries. There is no such thing as a right to
                compensation.
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                10.2 Pets are not permitted.
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                10.3 Valuables: There is no liability for valuables that are
                lost or stolen. As a precaution, make sure you have liability
                insurance and personal liability insurance in case of damage.
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                10.4 Smoking is prohibited throughout the property.
              </Typography>
            </Box>
            <Box my={3}>
              <Typography variant="h5">
                11. Individual clauses are invalid.
              </Typography>
              <Typography sx={{ marginTop: 2 }}>
                Individual provisions that are invalid do not invalidate the
                overall business result conditions.
              </Typography>
            </Box>
          </UserAgreement>
        </DialogContainer>
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
