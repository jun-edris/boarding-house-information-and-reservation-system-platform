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
import { FetchContext } from '../../../context/FetchContext';

export const tenant = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Contact Number' },
  { id: 'address', label: 'Address' },
];

const Tenant = () => {
  const fetchContext = useContext(FetchContext);
  const [allTenant, setAllTenant] = useState([]);

  const getAllTenant = () => {
    fetchContext.authAxios
      .get(`/admin//user/tenant`)
      .then(({ data }) => {
        setAllTenant(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    getAllTenant();

    return () => controller.abort();
  }, []);

  return (
    <>
      <Box>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4">List of All Tenant</Typography>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {tenant.map((req, index) => (
                    <TableCell key={index}>{req.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allTenant?.map((tenant, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {tenant?.firstName} {tenant?.lastName}
                      </TableCell>
                      <TableCell>{tenant?.email}</TableCell>
                      <TableCell>0{tenant?.contact}</TableCell>
                      <TableCell>
                        {tenant.barangay}, {tenant.city}, {tenant.province},{' '}
                        {tenant.region}
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

export default Tenant;
