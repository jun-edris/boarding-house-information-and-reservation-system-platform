import {
  Box,
  Button,
  Grid,
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
import React, { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../../../context/FetchContext';
import RequirementModal from '../../../../components/RequirementModal';
import { useTheme } from '@mui/styles';

export const BHDetails = [
  { id: 'name', label: 'House Name' },
  { id: 'owner', label: 'Owner' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'requirements', label: 'Requirements' },
];

const ApprovedHouses = () => {
  const theme = useTheme();
  const fetchContext = useContext(FetchContext);
  const [bHouses, setBHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState({});
  const [requirementsPopup, setRequirementsPopup] = useState(false);

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
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
    tableCellHeader: {
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
      width: 250,
      margin: 5,
      fontSize: 12,
    },
  });

  const handleModalClose = () => {
    setRequirementsPopup(false);
  };

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

  const MyDocument = () => (
    <Document>
      <Page orientation="landscape" size="LEGAL">
        <View style={{ paddingTop: 30, paddingRight: 30, paddingLeft: 30 }}>
          <Text style={styles.title}>
            All Approved Boarding House Information
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableCellHeader}>House Name</Text>
            <Text style={styles.tableCellHeader}>Owner</Text>
            <Text style={styles.tableCellHeader}>Rooms</Text>
          </View>
          {bHouses?.map((house) => (
            <View key={house?.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{house?.houseName}</Text>
              <Text style={styles.tableCell}>
                {house?.owner.firstName} {house?.owner.lastName}
              </Text>
              <Text style={styles.tableCell}>{house?.rooms?.length}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">
            List of All Approved Boarding House
          </Typography>
          <Button variant="contained">
            <PDFDownloadLink
              document={<MyDocument />}
              fileName="all_approved_bhouse_info.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : 'Download Data'
              }
            </PDFDownloadLink>
          </Button>
        </Box>
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
                      <Button
                        type="button"
                        variant="contained"
                        onClick={() => {
                          setSelectedHouse(house);
                          setRequirementsPopup(true);
                          // TODO view requirements
                        }}
                      >
                        View Requirements
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <RequirementModal
        open={requirementsPopup}
        closeModal={handleModalClose}
        house={selectedHouse}
      />
    </>
  );
};

export default ApprovedHouses;
