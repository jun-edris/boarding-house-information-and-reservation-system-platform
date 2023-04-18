import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DialogContainer = ({ title, open, onClose, children }) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth='lg'
			sx={{ borderRadius: 5 }}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>{children}</DialogContent>
		</Dialog>
	);
};

export default DialogContainer;
