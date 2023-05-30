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
import { useEffect, useState } from 'react';

const DialogContainer = ({
  title,
  open,
  onClose,
  children,
  scroll,
  setSelectedMenu,
  setOpenPopup,
  nextPopupTitle,
  cusWid,
}) => {
  const [accept, setAccept] = useState(false);

  useEffect(() => {
    if (!open) {
      setAccept(false); // Reset the state when the modal is closed
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={cusWid ? cusWid : 'lg'}
      sx={{ borderRadius: 5 }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {children}
        {scroll && (
          <FormControlLabel
            control={
              <Checkbox
                value={accept}
                onChange={() => {
                  if (accept === true) {
                    return setAccept(false);
                  }
                  if (accept === false) {
                    return setAccept(true);
                  }
                }}
              />
            }
            label="Accept Terms and Conditions"
          />
        )}
      </DialogContent>
      {scroll && (
        <DialogActions sx={{ px: 5, py: 3 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={!accept}
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
