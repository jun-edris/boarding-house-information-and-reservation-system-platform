import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import useRefMounted from '../../hooks/useRefMounted';
import { useContext, useState } from 'react';
import { FetchContext } from '../../context/FetchContext';
import { AuthContext } from '../../context/AuthContext';

const ReserveForm = ({ rooms, onClose }) => {
  const isMountedRef = useRefMounted();
  const fetchContext = useContext(FetchContext);
  const authContext = useContext(AuthContext);
  const [room, setRoom] = useState({});

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
      const { data } = await fetchContext.authAxios.get(`/room/${id}`);
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
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Formik
          initialValues={{
            roomId: '',
            dateToLive: '',
            dateToLeave: '',
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
            dateToLeave: Yup.date()
              .nullable()
              .transform((curr, orig) => (orig === '' ? null : curr))
              .when(
                'dateToLive',
                (dateToLive, schema) =>
                  dateToLive &&
                  schema.min(dateToLive, 'End date must be after Start date.')
              )
              .required('End Date is required'),
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
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  {Object.keys(room).length !== 0 ||
                  room?.image === '' ||
                  room?.image === null ? (
                    <img
                      src={room?.image}
                      alt={room?.roomName}
                      height="220"
                      width="100%"
                      aspectratio={1 / 1}
                    />
                  ) : (
                    <Typography variant="body1" component="p" align="center">
                      Choose a room to display room image
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="roomId">Available Rooms</InputLabel>
                        <Select
                          error={Boolean(touched.roomId && errors.roomId)}
                          labelId="roomId"
                          id="roomId"
                          value={values.roomId}
                          label="roomId"
                          onChange={(e) => {
                            handleChange(e);
                            getOneRoom(e.target.value);
                          }}
                          name="roomId"
                          displayEmpty
                        >
                          {rooms?.map((room, index) => (
                            <MenuItem key={room?._id} value={room?._id}>
                              {room?.roomName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {Boolean(touched.roomId && errors.roomId) && (
                        <FormHelperText error>{errors.roomId}</FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        name="dateToLive"
                        label="Date to Live"
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
                      <Field
                        name="dateToLeave"
                        label="Date to Leave"
                        component={CustomDateField}
                        showError={Boolean(
                          touched.dateToLeave && errors.dateToLeave
                        )}
                      />
                      {Boolean(touched.dateToLeave && errors.dateToLeave) && (
                        <FormHelperText error>
                          {errors.dateToLeave}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        sx={{
                          mt: 3,
                        }}
                        color="primary"
                        startIcon={
                          isSubmitting ? <CircularProgress size="1rem" /> : null
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
