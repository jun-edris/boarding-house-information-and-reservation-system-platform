import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FetchContext } from '../../context/FetchContext';
import { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import useRefMounted from '../../hooks/useRefMounted';

const ReasonForm = ({
  open,
  closeModal,
  reservationId,
  tenantId,
  decline,
  boardingHouse,
}) => {
  const isMountedRef = useRefMounted();
  // const [loading, setLoading] = useState(false);
  // const authContext = useContext(AuthContext);
  const fetchContext = useContext(FetchContext);

  const notify = async (type, values) => {
    try {
      const { reason } = values;

      const newValues = { tenantId: tenantId, type, reason };
      const { data } = await fetchContext.authAxios.post(
        `/notify/tenant`,
        newValues
      );

      toast.success(data.msg);
      // setLoading(false);
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const declineLeaveBH = async () => {
    try {
      const values = { tenantID: tenantId };
      const { data } = await fetchContext.authAxios.patch(
        `/reservation/leave/${reservationId}`,
        values
      );

      if (data) {
        toast.success(data.msg);
        return true;
      }
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const deleteNotifLandlord = async () => {
    try {
      const { data } = await fetchContext.authAxios.delete(
        `/notify/delete/landlord/${tenantId}`
      );

      return true;
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const declineReservation = async () => {
    try {
      const values = { tenantID: tenantId };
      const { data } = await fetchContext.authAxios.patch(
        `/reservation/decline/${reservationId}`,
        values
      );

      if (data) {
        toast.success(data.msg);
        return true;
      }
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const declineBH = async () => {
    try {
      await fetchContext.authAxios.delete(
        `/admin/boardinghouse/decline/${boardingHouse}`
      );
      fetchContext.setRefreshKey(1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={closeModal} fullWidth>
        <DialogTitle>Can you provide a reason?</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              reason: '',
            }}
            validationSchema={Yup.object().shape({
              reason: Yup.string().required('Please provide a comment!'),
            })}
            onSubmit={(
              values,
              { setErrors, setStatus, setSubmitting, resetForm }
            ) => {
              try {
                // reason(values);

                if (decline === 'declineLeaveBH') {
                  // console.log(values);
                  const declined = declineLeaveBH();

                  if (declined) {
                    notify('declineCancelation', values);
                    deleteNotifLandlord();
                  }
                }

                if (decline === 'declineReservation') {
                  const declined = declineReservation();

                  if (declined) {
                    notify('declineReservation', values);
                    deleteNotifLandlord();
                  }
                }

                if (decline === 'declineBH') {
                  const declined = declineBH();

                  if (declined) {
                    notify('declineBH', values);
                    deleteNotifLandlord();
                  }
                }

                if (isMountedRef.current) {
                  setStatus({ success: true });
                  setSubmitting(false);
                }

                setTimeout(() => {
                  fetchContext.setRefreshKey(fetchContext.refreshKey + 1);
                  resetForm(true);
                }, 900);
                closeModal();
              } catch (error) {
                console.log(error);
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
            }) => {
              return (
                <form onSubmit={handleSubmit} noValidate>
                  <TextField
                    error={Boolean(touched.reason && errors.reason)}
                    fullWidth
                    margin="dense"
                    helperText={touched.reason && errors.reason}
                    label="Comment"
                    name="reason"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.reason}
                    variant="filled"
                    multiline
                    minRows={10}
                  />
                  <Box
                    sx={{
                      mt: 3,
                    }}
                  >
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button
                      color="primary"
                      startIcon={
                        isSubmitting ? <CircularProgress size="1rem" /> : null
                      }
                      disabled={isSubmitting}
                      type="submit"
                      size="large"
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </Box>
                </form>
              );
            }}
          </Formik>
        </DialogContent>
      </Dialog>
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

export default ReasonForm;
