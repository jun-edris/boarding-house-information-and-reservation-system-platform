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
            <Paper variant="outlined" sx={{ py: 4, px: 2, height: '100%' }}>
              <img
                src={boardingHouse?.image}
                alt={boardingHouse?.houseName}
                width="100%"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} lg={9}>
            <Paper variant="outlined" sx={{ p: 3 }}>
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
                    boardingHouse?.approved
                      ? 'Approved'
                      : 'Waiting for Approval'
                  }
                  color={boardingHouse?.approved ? 'success' : 'warning'}
                />
              </Box>

              <Typography component="pre" sx={{ mt: 3 }}>
                {boardingHouse?.description}
              </Typography>
            </Paper>
          </Grid>

          {boardingHouse?.rooms?.length === 0 ? (
            <Grid item xs={12} mt={3}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography>No rooms added yet.</Typography>
              </Paper>
            </Grid>
          ) : (
            <Grid item xs={12} mt={3}>
              <Paper variant="outlined" sx={{ p: 3 }}>
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
              </Paper>
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
            <Typography variant="h5" align="center">
              Conditions and terms
            </Typography>
            <Typography variant="h5" align="center">
              (Admin and Boarding House Owner)
            </Typography>
            <Typography variant="h4" align="center" sx={{ mt: 2 }}>
              BOARDING HOUSE INFORMATION AND RESERVATION SYSTEM PLATFORM
              AGREEMENT
            </Typography>
          </Box>
          <Box my={3}>
            <ol>
              <li>This is a legally binding contract.</li>
              <li>This agreement is for use by a boarding house owner only.</li>
            </ol>
            <p style={{ textIndent: '60px', fontWeight: 'bold' }}>
              A boarding house landlady or landlord must:
            </p>
            <ul>
              <li>
                contain one or more boarding rooms, where tenants have exclusive
                rights to occupy particular sleep quarters.
              </li>
              <li>have communal facilities for shared use by the tenants</li>
              <li>
                be occupied or intended by the landlord to be occupied by at
                least six tenants.
              </li>
              <li>
                be intended to, or in fact does, last for 28 days or more.
              </li>
            </ul>
            <ol start={3}>
              <li>
                This agreement must be completed in full and signed by the
                tenant and landlord. The parties must record their full names
                correctly.
              </li>
              <li>
                The landlady or landlord must include a signed statement with
                any boarding house landlady or landlord agreement that covers
                what insulation a property has in the ceilings, floors, and
                walls, including where it is, what type it is, and what
                condition it is in.
              </li>
              <li>
                The landlady or landlord must also provide a statement to
                confirm they will comply, or already comply, with the healthy
                home standards. This statement can be combined with the Healthy
                Homes Standards Compliance Statement with one signature.
              </li>
              <li>
                The landlady or landlord must sign a statement about whether the
                property is insured and, if so, what the excess is. The landlady
                or landlord must also include a statement informing tenants that
                the insurance policy for the property is available on request.
              </li>
              <li>
                The landlady or landlord must <strong>comply</strong> with all
                the{' '}
                <strong>
                  BOARDING HOUSE INFORMATION AND RESERVATION SYSTEM PLATFORM
                </strong>{' '}
                agreements, such as{' '}
                <strong>
                  NBI Clearance, License Accreditation from BIR, Business
                  Permit, Fire Safety Inspection Certificate, Mayor’s Permit,
                  Certificate of Registration, and Sanitary Permit.
                </strong>
              </li>
              <li>
                All Boarding House properties must meet the requirements in the
                regulations regarding insulation and smoke alarms.
              </li>
              <li>
                Before signing this agreement, all parties should carefully read
                it and seek information from Tenancy Services if they are
                unclear about what they are agreeing to.
              </li>
              <li>
                If a bond is paid, the landlady or landlord must immediately
                provide a receipt to the tenant.
              </li>
              <li>Letting fees can’t be charged to tenants.</li>
            </ol>
          </Box>
          <Box>
            <Typography variant="h5" align="center">
              OUTLINE OF THE BOARDING HOUSE INFORMATION AND RESERVATION SYSTEM
              PLATFORM AGREEMENT
            </Typography>
          </Box>
          <Box my={3}>
            <ol>
              <li>Agreement</li>
            </ol>
            <ul>
              <li>Each party should keep a copy of this agreement.</li>
              <li>
                Changes in the particulars of either party must be notified to
                the other party within 10 working days.
              </li>
            </ul>
            <ol start={2}>
              <li>Rent</li>
            </ol>
            <ul>
              <li>
                The landlady or landlord shall not require rent to be paid more
                than 2 weeks in advance or until rent already paid has been used
                up.
              </li>
              <li>
                Receipts must be given immediately if rent is paid in cash.
              </li>
            </ul>
            <ol start={3}>
              <li>Boarding house owner responsibilities</li>
            </ol>
            <ul>
              <li>Provide the room in a reasonable state of cleanliness.</li>
              <li>
                Provide and maintain the room and boarding house to a reasonable
                state of repair and comply with all building, health, and safety
                requirements that apply to the premises.
              </li>
              <li>Allow the tenant quiet enjoyment of the room.</li>
              <li>
                Ensure the tenant has access to the room and toilet and bathroom
                facilities at all times and to other facilities at all
                reasonable hours.
              </li>
              <li>
                Ensure the house rules and fire evacuation procedures are on
                display in the boarding house at all times.
              </li>
              <li>
                Enforce the house rules in a fair and consistent manner and give
                7 days written notice of any new house rules.
              </li>
              <li>
                Pay rates and any insurance taken out by the landlady or
                landlord.
              </li>
              <li>
                Not interfere with the supply of any services to the premises.
              </li>
            </ul>
            <ol start={4}>
              <li>Tenant’s responsibilities</li>
            </ol>
            <ul>
              <li>Pay the rent on time.</li>
              <li>
                Keep the boarding room reasonably clean and tidy, and notify the
                landlady or landlord as soon as any repairs are needed. You may
                not withhold rent if you cannot get repairs done.
              </li>
            </ul>
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
