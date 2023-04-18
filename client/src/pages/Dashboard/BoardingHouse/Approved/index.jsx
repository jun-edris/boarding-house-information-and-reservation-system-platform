import {
  Box,
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

export const BHDetails = [
  { id: 'name', label: 'House Name' },
  { id: 'description', label: 'Description' },
  { id: 'owner', label: 'Owner' },
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
                    <TableCell sx={{ overflowWrap: 'break-word' }}>
                      <Typography component="pre">
                        {house?.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {house?.owner.firstName} {house?.owner.lastName}
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
