import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

const DialogContainer = ({
  title,
  open,
  onClose,
  children,
  scroll,
  setSelectedMenu,
  setOpenPopup,
  nextPopupTitle,
}) => {
  const [accept, setAccept] = useState(false);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      sx={{ borderRadius: 5 }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {children}
        {scroll && (
          <FormControlLabel
            control={<Checkbox onChange={() => setAccept(!accept)} />}
            label="Accept Terms and Conditions"
          />
        )}
      </DialogContent>
      {scroll && (
        <DialogActions sx={{ px: 5, py: 3 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={accept === false ? true : false}
            onClick={() => {
              onClose();
              setOpenPopup(true);
              setSelectedMenu(nextPopupTitle);
            }}
          >
            Accept
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DialogContainer;
