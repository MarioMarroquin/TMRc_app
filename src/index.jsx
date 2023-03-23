import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';

import theme from '@config/theme';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<Router basename='/'>
			<App />
		</Router>
	</ThemeProvider>
);
