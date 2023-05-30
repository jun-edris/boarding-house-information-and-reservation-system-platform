import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const CertDownloadButton = ({ certificateUrl, certificateName }) => {
  const isPdf = certificateUrl.endsWith('.pdf');
  const modifiedUrl = isPdf
    ? `${certificateUrl}?response-content-disposition=attachment;`
    : certificateUrl.replace('/upload/', '/upload/fl_attachment/');

  return (
    <a
      href={modifiedUrl}
      download={certificateName}
      target="_blank"
      rel="noreferrer"
    >
      <Button variant="contained" startIcon={<DownloadIcon />}>
        {certificateName}
      </Button>
    </a>
  );
};

export default CertDownloadButton;
