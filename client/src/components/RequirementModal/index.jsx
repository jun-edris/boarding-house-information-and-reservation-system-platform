import { Box, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import { Document, Page } from '@react-pdf/renderer';
import CertDownloadButton from '../CertDownloadButton';

const RequirementModal = ({ open, closeModal, house }) => {
  const isPdfFile = (url) => {
    // Check if the file URL ends with .pdf or if it has a PDF MIME type

    return url.endsWith('.pdf') || url.includes('application/pdf');
  };

  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth="false">
      <DialogContent>
        <Grid container spacing={2}>
          {house?.nbi && (
            <Grid item xs={2} sm={12} lg={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                {isPdfFile(house?.nbi) ? (
                  <Document file={house?.nbi} onLoadError={console.error}>
                    <Page pageNumber={1} width={200} />
                  </Document>
                ) : (
                  <img src={house?.nbi} alt="NBI" width="250" height="100%" />
                )}
                <CertDownloadButton
                  certificateUrl={house?.nbi}
                  certificateName="NBI Clearance"
                />
              </Box>
            </Grid>
          )}

          {house?.accreBIR && (
            <Grid item xs={2} sm={12} lg={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                {isPdfFile(house?.accreBIR) ? (
                  <Document file={house?.accreBIR} onLoadError={console.error}>
                    <Page pageNumber={1} width={200} />
                  </Document>
                ) : (
                  <img
                    src={house?.accreBIR}
                    alt="License Accreditation from BIR"
                    width="250"
                    height="100%"
                  />
                )}
                <CertDownloadButton
                  certificateUrl={house?.accreBIR}
                  certificateName="License Accreditation from BIR"
                />
              </Box>
            </Grid>
          )}
          {house?.bp && (
            <Grid item xs={2} sm={12} lg={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                {isPdfFile(house?.bp) ? (
                  <Document file={house?.bp} onLoadError={console.error}>
                    <Page pageNumber={1} width={200} />
                  </Document>
                ) : (
                  <img
                    src={house?.bp}
                    alt="Business Permit"
                    width="250"
                    height="100%"
                  />
                )}
                <CertDownloadButton
                  certificateUrl={house?.bp}
                  certificateName="Business Permit"
                />
              </Box>
            </Grid>
          )}
          {house?.fireCert && (
            <Grid item xs={2} sm={12} lg={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                {isPdfFile(house?.fireCert) ? (
                  <Document file={house?.fireCert} onLoadError={console.error}>
                    <Page pageNumber={1} width={200} />
                  </Document>
                ) : (
                  <img
                    src={house?.fireCert}
                    alt="Fire Safety Inspection Certificate"
                    width="250"
                    height="100%"
                  />
                )}
                <CertDownloadButton
                  certificateUrl={house?.fireCert}
                  certificateName="Fire Safety Inspection Certificate"
                />
              </Box>
            </Grid>
          )}
          {house?.mp && (
            <Grid item xs={2} sm={12} lg={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                {isPdfFile(house?.mp) ? (
                  <Document file={house?.mp} onLoadError={console.error}>
                    <Page pageNumber={1} width={200} />
                  </Document>
                ) : (
                  <img
                    src={house?.mp}
                    alt="Mayor’s Permit"
                    width="250"
                    height="100%"
                  />
                )}
                <CertDownloadButton
                  certificateUrl={house?.mp}
                  certificateName="Mayor’s Permit"
                />
              </Box>
            </Grid>
          )}
          {house?.certReg && (
            <Grid item xs={2} sm={12} lg={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                {isPdfFile(house?.certReg) ? (
                  <Document file={house?.certReg} onLoadError={console.error}>
                    <Page pageNumber={1} width={200} />
                  </Document>
                ) : (
                  <img
                    src={house?.certReg}
                    alt="Certificate of Registration"
                    width="250"
                    height="100%"
                  />
                )}
                <CertDownloadButton
                  certificateUrl={house?.certReg}
                  certificateName="Certificate of Registration"
                />
              </Box>
            </Grid>
          )}
          {house?.sp && (
            <Grid item xs={2} sm={12} lg={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                {isPdfFile(house?.sp) ? (
                  <Document file={house?.sp} onLoadError={console.error}>
                    <Page pageNumber={1} width={200} />
                  </Document>
                ) : (
                  <img
                    src={house?.sp}
                    alt="Sanitary Permit"
                    width="250"
                    height="100%"
                  />
                )}
                <CertDownloadButton
                  certificateUrl={house?.sp}
                  certificateName="Sanitary Permit"
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementModal;
