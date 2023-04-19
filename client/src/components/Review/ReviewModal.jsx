import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';
import ReactStars from 'react-stars';
import { FetchContext } from '../../context/FetchContext';
import { ToastContainer, toast } from 'react-toastify';
import useRefMounted from '../../hooks/useRefMounted';

const StarRatingInput = ({ field, form }) => {
  const handleRating = (value) => {
    form.setFieldValue(field.name, value);
  };

  return (
    <ReactStars
      count={5}
      value={field.value}
      onChange={handleRating}
      size={48}
      color2="#ffd700"
    />
  );
};

const ReviewModal = ({ room, boardingHouse }) => {
  const isMountedRef = useRefMounted();
  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const fetchContext = useContext(FetchContext);

  const review = async (values) => {
    try {
      const { data } = await fetchContext.authAxios.post(`/reviews`, values);

      if (data) {
        await updateUserAsReviewed();
        return toast.success(data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.msg);
    }
  };

  const updateUserAsReviewed = async () => {
    try {
      const { data } = await fetchContext.authAxios.patch(`/user/update`);

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

  useEffect(() => {
    if (
      authContext.authState.userInfo.reviewed === false &&
      room !== undefined
    ) {
      setShowModal(true);
    }
  }, [room]);

  const closeModal = () => {
    setShowModal(false);
  };

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Dialog open={showModal} onClose={closeModal} maxWidth="lg" fullWidth>
        <DialogContent>
          <Typography variant="h5">Leave us a review!</Typography>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Your review & rating helps local landlord.
          </Typography>
          <Box>
            <Formik
              initialValues={{
                boardingHouse: boardingHouse,
                room: room,
                rating: 0,
                description: '',
              }}
              validationSchema={Yup.object().shape({
                rating: Yup.number()
                  .required('Please provide a rating!')
                  .min(1, 'Please select a valid rating'),
                description: Yup.string().required('Please provide a comment!'),
              })}
              onSubmit={(
                values,
                { setErrors, setStatus, setSubmitting, resetForm }
              ) => {
                try {
                  review(values);

                  if (isMountedRef.current) {
                    setStatus({ success: true });
                    setSubmitting(false);
                  }

                  setTimeout(() => {
                    fetchContext.setRefreshKey(fetchContext.refreshKey + 1);
                    resetForm(true);
                  }, 900);
                  setShowModal(false);
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
                    <Field name="rating" component={StarRatingInput} />
                    {Boolean(touched.rating && errors.rating) && (
                      <FormHelperText error>{errors.rating}</FormHelperText>
                    )}

                    <TextField
                      error={Boolean(touched.description && errors.description)}
                      fullWidth
                      margin="dense"
                      helperText={touched.description && errors.description}
                      label="Comment"
                      name="description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      variant="filled"
                      multiline
                      minRows={10}
                    />
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
                      size="large"
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </form>
                );
              }}
            </Formik>
          </Box>
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

export default ReviewModal;
