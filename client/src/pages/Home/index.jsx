import { Container, Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import BHCards from '../../components/common/BHCards';
import { FetchContext } from '../../context/FetchContext';
import { AuthContext } from '../../context/AuthContext';

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
      <Container maxWidth={false}>
        {bHouses.length !== 0 ? (
          <Grid container direction="row" spacing={3} sx={{ mt: 1 }}>
            {bHouses?.map((house, index) => {
              return (
                <Grid item xs={12} md={6} lg={4} key={index}>
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
          <Grid container direction="row" spacing={3} sx={{ mt: 1 }}>
            <Grid item xl={2}>
              <Typography component="p">Nothing to display yet...</Typography>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Home;
