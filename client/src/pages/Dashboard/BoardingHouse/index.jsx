import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AuthContext } from '../../../context/AuthContext';
import { FetchContext } from '../../../context/FetchContext';
import DialogContainer from '../../../components/common/DialogContainer';
import BHForm from '../../../components/BHForm';
import RoomForm from '../../../components/RoomForm';
import { ToastContainer, toast } from 'react-toastify';
import UserAgreement from '../../../components/UserAgreement';

const BoardingHouse = () => {
  const authContext = useContext(AuthContext);
  const fetchContext = useContext(FetchContext);
  const [boardingHouse, setBoardingHouse] = useState({} || null);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [openAgreementPopup, setOpenAgreementPopup] = useState(false);
  const [openRoomPopup, setRoomPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [newRoom, setNewRoom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState({} || null);
  const [roomToDelete, setToDelete] = useState('');

  const handleModalClose = () => {
    setOpenPopup(false);
    setRoomPopup(false);
    setOpenDeletePopup(false);
  };

  const handleModalAgreementClose = () => {
    setOpenAgreementPopup(false);
  };

  const getUserHouse = async () => {
    fetchContext.authAxios
      .get(`/boardinghouse`)
      .then(({ data }) => {
        setBoardingHouse(data.boardingHouse);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeRoomToBH = async (id) => {
    try {
      await fetchContext.authAxios.patch(`/boardingHouse/remove-room/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRoom = async (id, handleModalClose) => {
    try {
      const data = await fetchContext.authAxios.delete(
        `/boardinghouse/room/${id}`
      );

      if (data.response.status === 400) {
        toast.error(data.response.data.msg);
      }

      if (data.response.status === 200) {
        toast.success(data.data.msg);
      }

      setTimeout(() => {
        fetchContext.setRefreshKey(fetchContext.refreshKey + 1);
        handleModalClose();
      }, 1200);
    } catch (error) {
      console.log(error);
      toast.error(error.msg);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getUserHouse();

    return () => controller.abort();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchContext.refreshKey]);

  return (
    <>
      <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
        <Grid item>
          {boardingHouse === null ||
          Object.keys(authContext.authState.userInfo).length === 0 ? (
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                setOpenAgreementPopup(true);
                // setOpenPopup(true);
                // setSelectedMenu('Add Listing');
              }}
            >
              Add Listing
            </Button>
          ) : (
            <Box>
              {boardingHouse && boardingHouse?.approved && (
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => {
                        setRoomPopup(true);
                        setNewRoom(true);
                        setSelectedMenu('Add Room');
                      }}
                    >
                      Add Rooms
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setOpenPopup(true);
                        setSelectedMenu('Update Boarding House');
                      }}
                    >
                      Update Boarding House
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
      {boardingHouse ? (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={3}>
            <Paper variant="outlined" sx={{ py: 4, px: 2 }}>
              <img
                src={boardingHouse?.image}
                alt={boardingHouse?.houseName}
                width="100%"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} lg={9}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h3"
                component="p"
                sx={{ fontWeight: 'bold' }}
              >
                {boardingHouse?.houseName}
              </Typography>
              <Chip
                label={
                  boardingHouse?.approved ? 'Approved' : 'Waiting for Approval'
                }
                color={boardingHouse?.approved ? 'success' : 'warning'}
              />
            </Box>

            <Typography component="pre" sx={{ mt: 3 }}>
              {boardingHouse?.description}
            </Typography>
          </Grid>

          {boardingHouse?.rooms?.length === 0 ? (
            <Grid item xs={12} mt={3}>
              <Typography>No rooms added yet.</Typography>
            </Grid>
          ) : (
            <Grid item xs={12} mt={3}>
              <Typography variant="h5" component="p">
                Rooms
              </Typography>
              <Grid container spacing={2} mt={1} alignItems="stretch">
                {boardingHouse?.rooms?.map((room, index) => {
                  return (
                    <Grid item xs={12} md={3} lg={3} key={index}>
                      <Card
                        sx={{
                          height: '100%',
                        }}
                      >
                        <CardMedia
                          sx={{ height: 200 }}
                          image={room.image}
                          title={room.type}
                        />
                        <CardContent>
                          <Box mb={2}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="h6"
                              sx={{ textTransform: 'capitalize' }}
                            >
                              {room.roomName}
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="body2"
                              component="span"
                              sx={{ textTransform: 'capitalize' }}
                            >
                              {room.roomType}
                            </Typography>
                          </Box>

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
                          <Box mt={2}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              component="span"
                              sx={{ display: 'block' }}
                            >
                              Allowed Tenants: {room.allowedTenants}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              component="span"
                            >
                              Price: ₱{room.prize}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ verticalAlign: 'end' }}>
                          <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => {
                              setRoomPopup(true);
                              setRoom(room);
                              setNewRoom(false);
                              setSelectedMenu('Update Room');
                            }}
                          >
                            Update Room
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                              setOpenDeletePopup(true);
                              setToDelete(room?._id);
                              setSelectedMenu('Delete Room');
                            }}
                          >
                            Delete Room
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          )}
        </Grid>
      ) : (
        <>
          <Typography sx={{ mt: 3 }}>Nothing to display yet...</Typography>
        </>
      )}

      <DialogContainer
        title="User Agreement"
        open={openAgreementPopup}
        scroll="scroll"
        onClose={handleModalAgreementClose}
        openPopup={openPopup}
        setSelectedMenu={setSelectedMenu}
        setOpenPopup={setOpenPopup}
        nextPopupTitle="Add Listing"
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
              owner is governed by these terms and conditions. You accept legal
              responsibility and acknowledge the content of these terms by
              confirming your reservation.
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
              2.2 The contract between you and the landlord is only formed when
              the Boarding House System Information and Reservation Platform
              Admin confirms your booking request in writing or by e-mail and
              you accept the terms and conditions
            </Typography>
          </Box>
          <Box my={3}>
            <Typography variant="h5">3. Prices and Services</Typography>
            <Typography sx={{ marginTop: 2 }}>
              3.1 The scope of the contractual services and the resulting prices
              are derived from the offer's terms of reference and the
              information in the reservation confirmation. The rate includes the
              costs of electricity, water, heating, and cleaning.
            </Typography>
            <Typography sx={{ marginTop: 2 }}>
              3.2 The agreed-upon prices include any applicable VAT.
              Specifications will be made in the confirmation of the reservation
              if there are discrepancies between the information in the offer
              and the information in the booking confirmation.
            </Typography>
            <Typography sx={{ marginTop: 2 }}>
              3.3 The contract is final and will not be modified as a
              consequence of late arrival and/or early departure due to illness
              or other reasons; the responsibility will not be assumed by the
              landlord or Boarding House System Information and Reservation
              Platform Admin for the reasons stated previously, and you will not
              be entitled to a proportional refund.
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
              5.1 You have the right to cancel your reservation at any time. We
              recommend that the decision to withdraw be made in writing for
              reasons of proof. In the event of withdrawal, we have the right to
              seek reimbursement from you for our expenses.
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <Typography>
                5.2 If the reservation is canceled, the following cancellation
                fees will be assessed:
              </Typography>
              <Typography sx={{ pl: 5, marginTop: 2 }}>
                a. According to the concluded contract, free cancellation of the
                reservation before the start of the schedule period (planned
                arrival) is possible for reservations up to 1 week per room.
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
              the grace period allowed by the Boarding House System Information
              and Reservation Platform Admin, the lessor has the right to
              withdraw from the entitled contract.
            </Typography>
          </Box>
          <Box my={3}>
            <Typography variant="h5">
              8. Accommodation/Taking Over/Return
            </Typography>
            <Typography sx={{ marginTop: 2 }}>
              8.1 Keys are distributed upon arrival, either personally or
              through an automated key dispenser system. More information is
              available directly from the Boarding House System Information and
              Reservation Platform Admin.
            </Typography>
          </Box>
          <Box my={3}>
            <Typography variant="h5">
              9. Asset/Obligation to Cooperate/Warranty/Claim Exclusion
            </Typography>
            <Typography sx={{ marginTop: 2 }}>
              9.1 As a tenant of the property, you and any co-users agree to
              take care of the property and its associated inventory. You are
              responsible for any missing or damaged items as well as inventory.
              Boarding House System Information and Reservation Platform Admin
              reserves all rights.
            </Typography>
          </Box>
          <Box my={3}>
            <Typography variant="h5">10. Miscellaneous</Typography>
            <Typography sx={{ marginTop: 2 }}>
              10.1 Noise Pollution: Avoid disturbing your neighbors. Please
              allow for normal and appropriate background noise, such as that
              produced by construction workers. We are not liable for any extra
              noise caused by road works or other activities outside the
              building's boundaries. There is no such thing as a right to
              compensation.
            </Typography>
            <Typography sx={{ marginTop: 2 }}>
              10.2 Pets are not permitted.
            </Typography>
            <Typography sx={{ marginTop: 2 }}>
              10.3 Valuables: There is no liability for valuables that are lost
              or stolen. As a precaution, make sure you have liability insurance
              and personal liability insurance in case of damage.
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
        open={openPopup}
        onClose={handleModalClose}
      >
        <BHForm onClose={handleModalClose} house={boardingHouse} />
      </DialogContainer>
      <DialogContainer
        title={selectedMenu}
        open={openRoomPopup}
        onClose={handleModalClose}
      >
        <RoomForm
          onClose={handleModalClose}
          room={!newRoom && room}
          boardingHouseId={boardingHouse?._id}
        />
      </DialogContainer>
      <DialogContainer
        title={selectedMenu}
        open={openDeletePopup}
        onClose={handleModalClose}
      >
        <Box pb={4}>
          <Typography>
            Are you sure you're going to delete this room?
          </Typography>
        </Box>

        <Box style={{ display: 'flex', gap: 10 }}>
          <Button
            disabled={loading}
            onClick={handleModalClose}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            startIcon={loading && <CircularProgress />}
            onClick={() => {
              setLoading(true);
              deleteRoom(roomToDelete, handleModalClose);
              removeRoomToBH(roomToDelete);
              setLoading(false);
            }}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </Box>
      </DialogContainer>
      <ToastContainer theme="colored" />
    </>
  );
};

export default BoardingHouse;
