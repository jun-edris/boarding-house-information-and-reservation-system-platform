import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { useTheme } from '@mui/styles';
import React, { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../../context/FetchContext';

export const tenant = [
  { id: 'status', label: 'Status' },
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Contact Number' },
  { id: 'address', label: 'Address' },
];

const Tenant = () => {
  const theme = useTheme();
  const fetchContext = useContext(FetchContext);
  const [allTenant, setAllTenant] = useState([]);

  const styles = StyleSheet.create({
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    table: {
      width: '100%',
      borderStyle: 'solid',
      padding: 30,
    },
    tableHeaderRow: {
      textTransform: 'capitalize',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
    tableCellHeader: {
      textTransform: 'capitalize',
      width: 250,
      margin: 5,
      fontSize: 12,
      fontWeight: 'bold',
      borderStyle: 'solid',
    },
    tableRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      borderStyle: 'solid',
      borderBottomWidth: 1,
    },
    tableCell: {
      textTransform: 'capitalize',
      width: 250,
      margin: 5,
      fontSize: 12,
    },
  });

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

  const MyDocument = () => (
    <Document>
      <Page orientation="landscape" size="LEGAL">
        <View style={{ paddingTop: 30, paddingRight: 30, paddingLeft: 30 }}>
          <Text style={styles.title}>All Tenant Information</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableCellHeader}>Status</Text>
            <Text style={styles.tableCellHeader}>Name</Text>
            <Text style={styles.tableCellHeader}>Email</Text>
            <Text style={styles.tableCellHeader}>Phone</Text>
          </View>
          {allTenant?.map((tenant) => (
            <View key={tenant?.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {tenant?.status === 'new' && 'Not Rented'}
                {(tenant?.status === 'requestedToReserve' ||
                  tenant?.status === 'requestedToLeave') &&
                  'Reserved'}
                {tenant?.status === 'living' && 'Rented'}
              </Text>
              <Text style={styles.tableCell}>
                {' '}
                {tenant?.firstName} {tenant?.lastName}
              </Text>
              <Text style={styles.tableCell}>{tenant?.email}</Text>
              <Text style={styles.tableCell}>0{tenant?.contact}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <Box>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4">List of All Tenant</Typography>
            <Button variant="contained">
              <PDFDownloadLink
                document={<MyDocument />}
                fileName="all_tenant_info.pdf"
              >
                {({ blob, url, loading, error }) =>
                  loading ? 'Loading document...' : 'Download Data'
                }
              </PDFDownloadLink>
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ mt: 3 }} id="tenant-table">
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
                        {tenant?.status === 'new' && (
                          <Chip label="Not Rented" color="info" />
                        )}
                        {(tenant?.status === 'requestedToReserve' ||
                          tenant?.status === 'requestedToLeave') && (
                          <Chip label="Reserved" color="warning" />
                        )}
                        {tenant?.status === 'living' && (
                          <Chip label="Rented" color="success" />
                        )}
                      </TableCell>
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
