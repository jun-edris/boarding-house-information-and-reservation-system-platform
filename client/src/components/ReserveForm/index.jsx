import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import useRefMounted from '../../hooks/useRefMounted';
import { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../context/FetchContext';
import { AuthContext } from '../../context/AuthContext';

const ReserveForm = ({ rooms, selectedRoom, onClose, open }) => {
  const isMountedRef = useRefMounted();
  const fetchContext = useContext(FetchContext);
  const authContext = useContext(AuthContext);
  const [room, setRoom] = useState({});
  const [mode, setMode] = useState('monthly');

  const CustomDateField = ({ field, form, showError, ...props }) => {
    const currentError = form.errors[field.name];

    return (
      <>
        <DatePicker
          disablePast
          name={field.name}
          value={field.value}
          format="MM/dd/yyyy"
          onError={(error) => {
            if (error !== currentError) {
              form.setFieldError(field.name, error);
            }
          }}
          onChange={(date) => form.setFieldValue(field.name, date, true)}
          slotProps={{ textField: { error: showError, fullWidth: true } }}
          {...props}
        />
      </>
    );
  };

  const reserve = async (values) => {
    try {
      const { data } = await fetchContext.authAxios.post(`/reserve`, values);

      toast.success(data.msg);

      if (data) {
        await requestRoom(data?.reservation);
        return true;
      }
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const requestRoom = async (reservationDetails) => {
    try {
      const { data } = await fetchContext.authAxios.patch(
        `/room/user/reserved-request`,
        reservationDetails
      );

      localStorage.setItem('userInfo', JSON.stringify(data.user));

      authContext.setAuthState({
        ...authContext.authState,
        userInfo: data.user,
      });
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const getOneRoom = async (id) => {
    try {
      const { data } = await fetchContext.authAxios.get(
        `/room/${selectedRoom?._id}`
      );
      setRoom(data.room);
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const notifyLandlord = async (id) => {
    try {
      const values = { roomId: id, type: 'toReserve' };
      const { data } = await fetchContext.authAxios.post(
        `/notify/landlord`,
        values
      );

      toast.success(data.msg);
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getOneRoom();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!open) {
      setRoom({}); // Reset the state when the modal is closed
    }
  }, [open]);

  const price = (price) => {
    const modifiedPrice =
      mode === 'daily' ? price / 30 : mode === 'weekly' ? price / 4 : price;
    const toFloat = parseFloat(modifiedPrice);
    return toFloat.toFixed(2);
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Formik
          initialValues={{
            roomId: selectedRoom?._id,
            dateToLive: '',
            modeOfLiving: 'monthly',
          }}
          validationSchema={Yup.object().shape({
            roomId: Yup.string()
              .oneOf(
                rooms?.map((room) => {
                  return room?._id;
                }),
                'Invalid room'
              )
              .required('Please choose a room'),
            dateToLive: Yup.date()
              .nullable()
              .transform((curr, orig) => (orig === '' ? null : curr))
              .required('Start Date is required'),
            // dateToLeave: Yup.date()
            //   .nullable()
            //   .transform((curr, orig) => (orig === '' ? null : curr))
            //   .when(
            //     'dateToLive',
            //     (dateToLive, schema) =>
            //       dateToLive &&
            //       schema.min(dateToLive, 'End date must be after Start date.')
            //   )
            //   .required('End Date is required'),
            modeOfLiving: Yup.string()
              .oneOf(['daily', 'weekly', 'monthly'], 'Invalid mode of living')
              .required('Please choose a role'),
          })}
          onSubmit={(
            values,
            { setErrors, setStatus, setSubmitting, resetForm }
          ) => {
            try {
              if (
                values.dateToLive.toISOString() ===
                values.dateToLeave.toISOString()
              )
                return toast.error('Dates should not be the same!');

              if (room?.tenants?.length === room?.allowedTenants) {
                return toast.error('Room is full!');
              }

              const reserved = reserve(values);

              if (reserved) {
                notifyLandlord(room?._id);
                // localStorage.setItem('userInfo[status]', 'requested');

                // let infoUser = localStorage.getItem('userInfo');
                // console.log(infoUser);
              }

              if (isMountedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
              }

              setTimeout(() => {
                fetchContext.setRefreshKey(fetchContext.refreshKey + 1);
                onClose(true);
              }, 1200);
            } catch (error) {
              toast.error(error.message);
              if (isMountedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: error.message });
                setSubmitting(false);
              }
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {Object.keys(room).length !== 0 || room?.image ? (
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
                                  room?.tenants.length !== room?.allowedTenants
                                    ? 'Rented By Tenants'
                                    : room?.tenants.length ===
                                      room?.allowedTenants
                                    ? 'Fully Rented'
                                    : 'Vacant'
                                }
                                size="small"
                                color={
                                  room?.tenants.length > 0 &&
                                  room?.tenants.length !== room?.allowedTenants
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
                                sx={{ textTransform: 'capitalize' }}
                              >
                                Price {mode}:{' '}
                                <strong>₱{price(room.prize)}</strong>
                              </Typography>
                            </Box>
                          </Box>
                        </Alert>
                      </CardContent>
                    </Card>
                  ) : (
                    <Box sx={{ backgroundColor: '#cdcdcd', p: 10 }}>
                      <Typography variant="body1" component="p" align="center">
                        Choose a room to display room image
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: '100%' }}>
                    <Box my={2}>
                      <Typography variant="h5" component="p" align="center">
                        Reserve
                      </Typography>
                    </Box>
                    <Grid
                      container
                      spacing={2}
                      direction="column"
                      justifyContent="space-between"
                      alignItems="stretch"
                    >
                      <Grid item xs={12}>
                        <TextField
                          label={room?.roomName}
                          InputProps={{
                            readOnly: true,
                          }}
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="dateToLive"
                          label="Start of Stay"
                          component={CustomDateField}
                          showError={Boolean(
                            touched.dateToLive && errors.dateToLive
                          )}
                        />
                        {Boolean(touched.dateToLive && errors.dateToLive) && (
                          <FormHelperText error>
                            {errors.dateToLive}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="filled">
                          <InputLabel id="role">Pay By</InputLabel>
                          <Select
                            error={Boolean(
                              touched.modeOfLiving && errors.modeOfLiving
                            )}
                            labelId="modeOfLiving"
                            id="modeOfLiving"
                            value={values.modeOfLiving}
                            label="Pay By"
                            onChange={(e) => {
                              handleChange(e);
                              setMode(e.target.value);
                            }}
                            name="modeOfLiving"
                          >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                          </Select>
                        </FormControl>
                        {Boolean(touched.role && errors.role) && (
                          <FormHelperText error>{errors.role}</FormHelperText>
                        )}
                        {/* <Field
                          name="dateToLeave"
                          label="End of Stay"
                          component={CustomDateField}
                          showError={Boolean(
                            touched.dateToLeave && errors.dateToLeave
                          )}
                        />
                        {Boolean(touched.dateToLeave && errors.dateToLeave) && (
                          <FormHelperText error>
                            {errors.dateToLeave}
                          </FormHelperText>
                        )} */}
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          sx={{
                            mt: 3,
                          }}
                          color="primary"
                          startIcon={
                            isSubmitting ? (
                              <CircularProgress size="1rem" />
                            ) : null
                          }
                          disabled={isSubmitting}
                          type="submit"
                          fullWidth
                          size="large"
                          variant="contained"
                        >
                          Reserve
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </LocalizationProvider>
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

export default ReserveForm;
