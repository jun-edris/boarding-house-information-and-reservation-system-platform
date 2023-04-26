import { Box, Container, Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import BHCards from '../../components/common/BHCards';
import { FetchContext } from '../../context/FetchContext';

const Home = () => {
  const fetchContext = useContext(FetchContext);
  const [bHouses, setBHouses] = useState([]);

  const getApprovedBH = async () => {
    fetchContext.authAxios
      .get(`/boardinghouse/approved`)
      .then(({ data }) => {
        setBHouses(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const expiredReservation = async () => {
    fetchContext.authAxios
      .patch(`/reservation/expire`)
      .then(({ data }) => {
        console.log(data.msg);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const controller = new AbortController();

    expiredReservation();
    getApprovedBH();

    return () => controller.abort();
  }, [fetchContext.refreshKey]);

  return (
    <>
      <Box
        sx={{
          background: `url(/home.jpg)`,
          height: 500,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1,
          },
        }}
      >
        <Typography
          variant="h1"
          component="body2"
          color="white"
          sx={{ zIndex: 1 }}
        >
          Welcome to Boarding House System
        </Typography>
      </Box>
      <Container
        maxWidth={false}
        sx={{ height: '100%', minHeight: '100vh', backgroundColor: 'white' }}
      >
        <Box pt={5}>
          <Typography variant="h4" component="h4" mb={3} align="center">
            Boarding Houses
          </Typography>
          {bHouses.length !== 0 ? (
            <Grid container direction="row" spacing={2}>
              {bHouses?.map((house, index) => {
                return (
                  <Grid item xs={12} md={6} lg={3} key={index}>
                    <BHCards
                      img={house.image}
                      name={house?.houseName}
                      address={`${house?.owner.barangay}, ${house.owner.city}, ${house.owner.province}, ${house.owner.region}`}
                      id={house?._id}
                      description={house?.description}
                    />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Grid container direction="row" spacing={3}>
              <Grid item xl={2}>
                <Typography component="p">Nothing to display yet...</Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
