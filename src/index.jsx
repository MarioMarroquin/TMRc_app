import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';

import { ApolloProvider } from '@apollo/client';
import client from '@graphql';
import { LoadingProvider } from '@providers/loading';
import { SessionProvider } from '@providers/session';
import theme from '@config/theme/theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<LocalizationProvider dateAdapter={AdapterDateFns}>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<ApolloProvider client={client}>
				<LoadingProvider>
					<SessionProvider>
						<Router basename='/'>
							<App />
						</Router>
					</SessionProvider>
				</LoadingProvider>
			</ApolloProvider>
		</ThemeProvider>
	</LocalizationProvider>
);
