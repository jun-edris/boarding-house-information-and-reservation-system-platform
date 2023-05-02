import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../../../context/FetchContext';

export const BHDetails = [
  { id: 'name', label: 'House Name' },
  { id: 'owner', label: 'Owner' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'requirements', label: 'Requirements' },
];

const ApprovedHouses = () => {
  const fetchContext = useContext(FetchContext);
  const [bHouses, setBHouses] = useState([]);

  const getApprovedBH = async () => {
    fetchContext.authAxios
      .get(`/admin/boardinghouse/approved`)
      .then(({ data }) => {
        setBHouses(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    getApprovedBH();

    return () => controller.abort();
  }, [fetchContext.refreshKey]);

  return (
    <>
      <Box>
        <Typography variant="h4">
          List of All Approved Boarding House
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {BHDetails.map((req, index) => (
                  <TableCell key={index}>{req.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bHouses?.map((house, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{house?.houseName}</TableCell>
                    <TableCell>
                      {house?.owner.firstName} {house?.owner.lastName}
                    </TableCell>
                    <TableCell>
                      <Typography>{house?.rooms?.length}</Typography>
                    </TableCell>
                    <TableCell sx={{ width: 300 }}>
                      <Grid container spacing={2} columnSpacing={3}>
                        {house?.nbi && (
                          <Grid item lg={12}>
                            <Button variant="contained" fullWidth>
                              NBI Clearance
                            </Button>
                          </Grid>
                        )}

                        {house?.accreBIR && (
                          <Grid item lg={12}>
                            <Button variant="contained" fullWidth>
                              License Accreditation from BIR
                            </Button>
                          </Grid>
                        )}
                        {house?.bp && (
                          <Grid item lg={12}>
                            <Button variant="contained" fullWidth>
                              Business Permit
                            </Button>
                          </Grid>
                        )}
                        {house?.fireCert && (
                          <Grid item lg={12}>
                            <Button variant="contained" fullWidth>
                              Fire Safety Inspection Certificate
                            </Button>
                          </Grid>
                        )}
                        {house?.mp && (
                          <Grid item lg={12}>
                            <Button variant="contained" fullWidth>
                              Mayor’s Permit
                            </Button>
                          </Grid>
                        )}
                        {house?.certReg && (
                          <Grid item lg={12}>
                            <Button variant="contained" fullWidth>
                              Certificate of Registration
                            </Button>
                          </Grid>
                        )}
                        {house?.sp && (
                          <Grid item lg={12}>
                            <Button variant="contained" fullWidth>
                              Sanitary Permit
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default ApprovedHouses;
