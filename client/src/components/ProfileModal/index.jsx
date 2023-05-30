import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';

const ProfileModal = ({ open, closeModal, user }) => {
  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth="lg">
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {user.image ? (
                <img
                  src={user?.image}
                  alt={user?.firstName}
                  width="100%"
                  height={250}
                />
              ) : (
                <Avatar sx={{ height: 150, width: 150 }} />
              )}
            </Box>
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
                  <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                    {user?.firstName} {user?.middleName?.substr(0, 1)}.{' '}
                    {user?.lastName}
                  </Typography>
                  <Typography
                    variant="button"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {user?.role === 'tenant'
                      ? 'Boarder'
                      : user.role === 'landlord'
                      ? 'Boarding House Owner'
                      : user.role}
                  </Typography>
                </Box>

                <Chip
                  label={user?.active ? 'Active' : 'Not Active'}
                  color={user?.active ? 'success' : 'default'}
                />
              </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1">Email: {user.email}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Parent: {user.parent ? user.parent : 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Contact Number: 0{user.contact}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Address: {user.barangay}, {user.city}, {user.province},{' '}
                {user.region}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
