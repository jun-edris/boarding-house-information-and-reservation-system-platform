import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../../../context/FetchContext';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { ToastContainer, toast } from 'react-toastify';
import CertDownloadButton from '../../../../components/CertDownloadButton';
import ReasonForm from '../../../../components/Reason/ReasonForm';
import { AuthContext } from '../../../../context/AuthContext';
import RequirementModal from '../../../../components/RequirementModal';

export const BHDetails = [
  { id: 'name', label: 'House Name' },
  { id: 'description', label: 'Description' },
  { id: 'owner', label: 'Owner' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'action', label: 'Action' },
];
const PendingHouse = () => {
  const fetchContext = useContext(FetchContext);
  const [bHouses, setBHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState({});
  const [reasonPopup, setReasonPopup] = useState(false);
  const [requirementsPopup, setRequirementsPopup] = useState(false);
  const authContext = useContext(AuthContext);
  const [boardingHouseId, setBoardingHouseId] = useState('');
  const [decline, setDecline] = useState('');
  // const [reservationId, setReservationId] = useState('');
  const [ownerId, setOwnerId] = useState('');

  const handleModalClose = () => {
    setReasonPopup(false);
    setRequirementsPopup(false);
  };

  const getPendingBH = async () => {
    fetchContext.authAxios
      .get(`/admin/boardinghouse/not/approved`)
      .then(({ data }) => {
        setBHouses(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const approveBH = async (id) => {
    setLoading(true);
    try {
      const data = { id };
      await fetchContext.authAxios.patch(`/admin/boardinghouse`, data);
      setLoading(false);
      toast.success('Boarding House approved!');
      fetchContext.setRefreshKey(1);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getPendingBH();
    const notifChannel = authContext.pusher.subscribe('notify');

    notifChannel.bind('notify-landlord', (newReq) => {
      getPendingBH();

      // setRecords((records) => [...records, newReq]);
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });
    return () => controller.abort();
  }, [fetchContext.refreshKey]);

  return (
    <>
      <Box>
        <Typography variant="h4">List of All Pending Boarding House</Typography>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {BHDetails.map((req, index) => (
                  <TableCell key={index} color="white">
                    {req.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bHouses?.map((house, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{house?.houseName}</TableCell>
                    <TableCell sx={{ overflowWrap: 'break-word' }}>
                      <Typography component="pre">
                        {house?.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {house?.owner.firstName} {house?.owner.lastName}
                    </TableCell>
                    <TableCell sx={{ width: 650 }}>
                      <Button
                        type="button"
                        variant="contained"
                        onClick={() => {
                          setSelectedHouse(house);
                          setRequirementsPopup(true);
                          // TODO view requirements
                        }}
                      >
                        View Requirements
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Grid container spacing={2} justifyContent="stretch">
                        <Grid item>
                          <Button
                            variant="contained"
                            color="success"
                            disabled={loading === true}
                            startIcon={
                              loading === true ? (
                                <CircularProgress size={20} color="primary" />
                              ) : (
                                <AddTaskIcon />
                              )
                            }
                            onClick={() => {
                              approveBH(house?._id);
                            }}
                          >
                            Approve
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="error"
                            disabled={loading === true}
                            startIcon={
                              loading === true ? (
                                <CircularProgress size={20} color="primary" />
                              ) : (
                                <AddTaskIcon />
                              )
                            }
                            onClick={() => {
                              setReasonPopup(true);
                              setDecline('declineBH');
                              setOwnerId(house?.owner?._id);
                              setBoardingHouseId(house?._id);
                              // declineBH(house?._id);
                            }}
                          >
                            Decline
                          </Button>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <ReasonForm
        open={reasonPopup}
        closeModal={handleModalClose}
        decline={decline}
        boardingHouse={boardingHouseId}
        tenantId={ownerId}
      />
      <RequirementModal
        open={requirementsPopup}
        closeModal={handleModalClose}
        house={selectedHouse}
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

export default PendingHouse;
