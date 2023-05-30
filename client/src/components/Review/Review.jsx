import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReactStars from 'react-stars';
import { FetchContext } from '../../context/FetchContext';
import { AuthContext } from '../../context/AuthContext';

const Review = ({ setReviewModal, showModal, setShowModal }) => {
  // const fetchContext = useContext(FetchContext);
  const authContext = useContext(AuthContext);

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const storedState = localStorage.getItem('showModalLater');
    if (storedState) {
      return authContext.setShowModalLater(JSON.parse(storedState));
    }
  }, []);

  return (
    <Dialog open={showModal} onClose={closeModal}>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <ReactStars
            count={5}
            value={5}
            edit={false}
            size={50}
            color2="#ffd700"
          />
          <Box>
            <Typography variant="h3">Rate Your Experience With Us</Typography>
            <Typography variant="body2" align="center" sx={{ marginTop: 3 }}>
              Leave Us a Review
            </Typography>
          </Box>
          <Grid
            container
            spacing={2}
            justifyContent="stretch"
            sx={{ marginTop: 5 }}
          >
            <Grid item xs={6}>
              <Button
                onClick={() => {
                  authContext.setShowModalLater(true);
                  localStorage.setItem('showModalLater', JSON.stringify(true));
                  setShowModal(false);
                  closeModal();
                }}
                fullWidth
              >
                Later
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              onClick={() => {
                setReviewModal(true);
                closeModal();
              }}
            >
              <Button variant="contained" fullWidth>
                Sure
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Review;
