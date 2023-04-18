import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
	palette: {
		primary: {
			main: '#FF5A5F',
			dark: '#CC4C4F',
			light: '#FFAFAF',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#008489',
			dark: '#006666',
			light: '#6FB3B8',
			contrastText: '#FFFFFF',
		},
		text: {
			primary: '#484848',
			secondary: '#767676',
		},
		background: {
			default: '#F7F7F7',
			paper: '#FFFFFF',
		},
	},
	shape: {
		borderRadius: 8,
	},
	typography: {
		fontFamily: 'Circular, Arial, sans-serif',
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 700,
		h1: {
			fontWeight: 700,
			fontSize: '3.5rem',
			lineHeight: 1.2,
			letterSpacing: '-0.01562em',
		},
		h2: {
			fontWeight: 700,
			fontSize: '2.5rem',
			lineHeight: 1.2,
			letterSpacing: '-0.00833em',
		},
		h3: {
			fontWeight: 700,
			fontSize: '2rem',
			lineHeight: 1.2,
			letterSpacing: '0em',
		},
		h4: {
			fontWeight: 700,
			fontSize: '1.5rem',
			lineHeight: 1.2,
			letterSpacing: '0.00735em',
		},
		h5: {
			fontWeight: 700,
			fontSize: '1.25rem',
			lineHeight: 1.2,
			letterSpacing: '0em',
		},
		h6: {
			fontWeight: 500,
			fontSize: '1rem',
			lineHeight: 1.2,
			letterSpacing: '0.0075em',
		},
		subtitle1: {
			fontWeight: 700,
			fontSize: '1rem',
			lineHeight: 1.2,
			letterSpacing: '0.00938em',
		},
		subtitle2: {
			fontWeight: 500,
			fontSize: '0.875rem',
			lineHeight: 1.2,
			letterSpacing: '0.00714em',
		},
		body1: {
			fontWeight: 400,
			fontSize: '1rem',
			lineHeight: 1.5,
			letterSpacing: '0.00938em',
		},
		body2: {
			fontWeight: 400,
			fontSize: '0.875rem',
			lineHeight: 1.5,
			letterSpacing: '0.01071em',
		},
		button: {
			fontWeight: 700,
			fontSize: '0.875rem',
			lineHeight: 1.5,
			letterSpacing: '0.02857em',
			textTransform: 'none',
		},
		caption: {
			fontWeight: 400,
			fontSize: '0.75rem',
			lineHeight: 1.5,
			letterSpacing: '0.03333em',
		},
		overline: {
			fontWeight: 700,
			fontSize: '0.75rem',
			lineHeight: 1.5,
			letterSpacing: '0.16667em',
			textTransform: 'uppercase',
		},
	},
	overrides: {
		MuiButton: {
			root: {
				borderRadius: 4,
			},
			textPrimary: {
				color: '#FF5A5F',
			},
		},
		MuiInputBase: {
			root: {
				borderRadius: 4,
			},
		},
		MuiOutlinedInput: {
			root: {
				borderRadius: 4,
			},
		},
		MuiSelect: {
			icon: {
				color: '#767676',
			},
		},
		MuiChip: {
			root: {
				borderRadius: 16,
			},
		},
		MuiPaper: {
			elevation1: {
				boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
			},
		},
	},
});

export default customTheme;
