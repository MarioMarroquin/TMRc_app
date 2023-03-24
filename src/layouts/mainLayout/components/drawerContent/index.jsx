import { Fragment } from 'react';
import {
	Avatar,
	Box,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	useTheme,
} from '@mui/material';
import {
	Analytics,
	Assessment,
	BookOnline,
	DriveEta,
	Home,
	Message,
	MiscellaneousServices,
	Payments,
	Person,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import TMRLogo from '@utils/logo/TMR_logo.svg';

const DrawerContent = () => {
	const location = useLocation().pathname;
	const navigate = useNavigate();
	const theme = useTheme();

	const isSelected = (loc) => {
		let color = '';

		if (location === loc) color = theme.palette.secondary.main;

		return color || '#afafaf';
	};

	return (
		<Fragment>
			<Toolbar
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					px: [1],
				}}
			>
				<img src={TMRLogo} alt={'TMR Logo'} width={100} />
			</Toolbar>

			{/* <Divider /> */}

			<List component={'nav'}>
				<ListItemButton
					selected={location === '/home'}
					onClick={() => navigate('home', { replace: true })}
				>
					<ListItemIcon>
						<Home sx={{ color: isSelected('/home') }} />
					</ListItemIcon>
					<ListItemText primary={'Inicio'} />
				</ListItemButton>

				<ListItemButton
					selected={location === '/statistics'}
					onClick={() => navigate('statistics', { replace: true })}
				>
					<ListItemIcon>
						<Analytics sx={{ color: isSelected('/statistics') }} />
					</ListItemIcon>
					<ListItemText primary={'Estadísticas'} />
				</ListItemButton>

				<ListItemButton
					selected={location === '/messages'}
					onClick={() => navigate('messages', { replace: true })}
				>
					<ListItemIcon>
						<Message sx={{ color: isSelected('/messages') }} />
					</ListItemIcon>
					<ListItemText primary={'Mensajes'} />
				</ListItemButton>

				<ListItemButton
					selected={location === '/reports'}
					onClick={() => navigate('reports', { replace: true })}
				>
					<ListItemIcon>
						<Assessment sx={{ color: isSelected('/reports') }} />
					</ListItemIcon>
					<ListItemText primary={'Reportes'} />
				</ListItemButton>

				<ListItemButton
					selected={location === '/clients'}
					onClick={() => navigate('clients', { replace: true })}
				>
					<ListItemIcon>
						<Person sx={{ color: isSelected('/clients') }} />
					</ListItemIcon>
					<ListItemText primary={'Clientes'} />
				</ListItemButton>
			</List>
		</Fragment>
	);
};

export default DrawerContent;
