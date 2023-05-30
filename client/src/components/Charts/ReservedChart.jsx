import Chart from 'react-apexcharts';
import { Box, Button, Card } from '@mui/material';
import {
  Document,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { useTheme } from '@mui/styles';

const ReservedChart = ({ data }) => {
  const theme = useTheme();

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

  const countByDate = data.reduce((acc, curr) => {
    const date = curr.updatedAt.substring(0, 10);
    if (acc[date]) {
      acc[date]++;
    } else {
      acc[date] = 1;
    }
    return acc;
  }, {});

  const chartData = Object.entries(countByDate).map(([date, count]) => ({
    x: new Date(date).getTime(),
    y: count,
  }));

  const combinedData = Object.entries(countByDate).map(([date, count]) => ({
    date: new Date(date).toISOString().substring(0, 10),
    count: count,
  }));

  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function (value, timestamp) {
          const date = new Date(value);
          const options = { weekday: 'short', month: 'short', day: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-US', options);
          return formattedDate;
        },
      },
      tickAmount: 7,
      tickPlacement: 'between',
    },
    yaxis: {
      title: {
        text: 'Number of Tenants Living',
      },
    },
  };

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
            <Text style={styles.tableCellHeader}>Date</Text>
            <Text style={styles.tableCellHeader}>Number of People</Text>
          </View>
          {combinedData?.map((data) => (
            <View key={data?.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{data?.date}</Text>
              <Text style={styles.tableCell}>{data?.count}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 2 }}>
          <Button variant="contained">
            <PDFDownloadLink
              document={<MyDocument />}
              fileName="people_reserved.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : 'Download Data'
              }
            </PDFDownloadLink>
          </Button>
        </Box>
        <Chart
          options={options}
          series={[{ name: 'Living Tenants', data: chartData }]}
          type="bar"
          height={350}
        />
      </Card>
    </div>
  );
};

export default ReservedChart;
