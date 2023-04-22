import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DialogContainer from '../../components/common/DialogContainer';
import RegisterForm from '../../components/AuthForm/Register/RegisterForm';

const Profile = () => {
  const [open, setOpen] = useState(false);
  const authContext = useContext(AuthContext);

  const handleModalClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Update Details
          </Button>
        </Box>
        <Paper elevation={0} variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} lg={4}>
              {authContext.authState.userInfo.role !== 'admin' ||
              authContext.authState.userInfo.image ? (
                <img
                  src={
                    authContext.authState.userInfo.image
                      ? authContext.authState.userInfo.image
                      : null
                  }
                  alt={
                    authContext.authState.userInfo.image
                      ? `${authContext.authState.userInfo.firstName} ${authContext.authState.userInfo.lastName}`
                      : null
                  }
                  width="100%"
                  height={250}
                />
              ) : (
                <Avatar sx={{ height: 150, width: 150 }} />
              )}
            </Grid>
            <Grid item xs={12} lg={8}>
              <Box py={1}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {authContext.authState.userInfo.firstName}{' '}
                      {authContext.authState.userInfo.middleName.substr(0, 1)}.{' '}
                      {authContext.authState.userInfo.lastName}
                    </Typography>
                    <Typography
                      variant="button"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {authContext.authState.userInfo.role}
                    </Typography>
                  </Box>

                  <Chip
                    label={
                      authContext.authState.userInfo.active
                        ? 'Active'
                        : 'Not Active'
                    }
                    color={
                      authContext.authState.userInfo.active
                        ? 'success'
                        : 'default'
                    }
                  />
                </Box>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1">
                  Email: {authContext.authState.userInfo.email}
                </Typography>
                {authContext.authState.userInfo.role !== 'admin' && (
                  <>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Contact Number: 0{authContext.authState.userInfo.contact}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Address: {authContext.authState.userInfo.barangay},{' '}
                      {authContext.authState.userInfo.city},{' '}
                      {authContext.authState.userInfo.province},{' '}
                      {authContext.authState.userInfo.region}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <DialogContainer
        title="Update User Profile"
        open={open}
        onClose={handleModalClose}
      >
        <RegisterForm user={authContext.authState.userInfo} />
      </DialogContainer>
    </>
  );
};

export default Profile;
