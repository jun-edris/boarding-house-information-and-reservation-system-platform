import {
  Box,
  Button,
  CircularProgress,
  Paper,
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

export const landlord = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Contact Number' },
  { id: 'address', label: 'Address' },
  // { id: 'action', label: 'Action' },
];

const Landlord = () => {
  const fetchContext = useContext(FetchContext);
  const [allLandlord, setAllLandlord] = useState([]);

  const getAllLandlord = () => {
    fetchContext.authAxios
      .get(`/admin/user/landlord`)
      .then(({ data }) => {
        setAllLandlord(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    getAllLandlord();

    return () => controller.abort();
  }, []);

  return (
    <>
      <Box>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4">List of All Landlord</Typography>

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {landlord.map((req, index) => (
                    <TableCell key={index}>{req.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allLandlord?.map((landlord, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {landlord?.firstName} {landlord?.lastName}
                      </TableCell>
                      <TableCell>{landlord?.email}</TableCell>
                      <TableCell>0{landlord?.contact}</TableCell>
                      <TableCell>
                        {landlord.barangay}, {landlord.city},{' '}
                        {landlord.province}, {landlord.region}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default Landlord;
