import { CssBaseline, ThemeProvider } from '@mui/material';
import customTheme from './constants/theme';
import { AuthProvider } from './context/AuthContext';
import { FetchProvider } from './context/FetchContext';
import Routes from './routes';

const App = () => {
	return (
		<ThemeProvider theme={customTheme}>
			<AuthProvider>
				<FetchProvider>
					<Routes />
					<CssBaseline />
				</FetchProvider>
			</AuthProvider>
		</ThemeProvider>
	);
};

export default App;
