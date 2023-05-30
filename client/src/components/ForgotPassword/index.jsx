import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Formik } from 'formik';
import useRefMounted from '../../hooks/useRefMounted';
import { publicFetch } from '../../config/fetch';

const ForgotPassword = ({ open, closeModal }) => {
  const isMountedRef = useRefMounted();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPass: '',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('The email provided should be a valid email address')
              .max(255)
              .required('The email  field is required'),
            password: Yup.string()
              .max(255)
              .required('The password field is required'),
            confirmPass: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Confirm your password'),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              const { data } = await publicFetch.patch(
                `/auth/forgotpassword`,
                values
              );

              toast.success(data.msg);

              if (isMountedRef.current && data) {
                setStatus({ success: true });
                setSubmitting(false);
              }
              closeModal();
            } catch (error) {
              toast.error(error.response.data.msg);
              if (isMountedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: error.response.data.msg });
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
              <TextField
                error={Boolean(touched.email && errors.email)}
                fullWidth
                margin="dense"
                helperText={touched.email && errors.email}
                label={'Email'}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
                variant="filled"
              />
              <TextField
                error={Boolean(touched.password && errors.password)}
                fullWidth
                margin="dense"
                helperText={touched.password && errors.password}
                label={'Password'}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                variant="filled"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                error={Boolean(touched.confirmPass && errors.confirmPass)}
                fullWidth
                margin="dense"
                helperText={touched.confirmPass && errors.confirmPass}
                label={'Confirm Password'}
                name="confirmPass"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPass}
                variant="filled"
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        onMouseDown={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                fullWidth
                size="large"
                variant="contained"
              >
                {'Change Password'}
              </Button>
            </form>
          )}
        </Formik>
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
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
