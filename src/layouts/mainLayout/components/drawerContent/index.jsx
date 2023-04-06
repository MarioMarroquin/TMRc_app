import { Fragment, useEffect } from 'react';
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
	SettingsPhone,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import TMRLogo from '@utils/logo/TMR_logo.svg';
import routes from '@layouts/mainLayout/components';

const DrawerContent = () => {
	const location = useLocation().pathname;
	const navigate = useNavigate();
	const theme = useTheme();

	useEffect(() => {
		document.documentElement.scrollTop = 0;
		document.scrollingElement.scrollTop = 0;
	}, [location]);

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
				{routes.map(({ icon, name, path }) => {
					return (
						<ListItemButton
							key={path}
							selected={location === path}
							onClick={() => navigate(path, { replace: true })}
						>
							<ListItemIcon sx={{ color: isSelected(path) }}>
								{icon}
							</ListItemIcon>
							<ListItemText primary={name} />
						</ListItemButton>
					);
				})}
			</List>
		</Fragment>
	);
};

export default DrawerContent;
