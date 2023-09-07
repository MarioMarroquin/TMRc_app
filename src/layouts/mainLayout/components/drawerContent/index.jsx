import { Fragment } from 'react';
import {
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import TMRLogo from '@utils/logo/TMR_logo.svg';
import { adminRoutes } from '../../../../routes';

const DrawerContent = () => {
	const location = useLocation().pathname;
	const navigate = useNavigate();
	const theme = useTheme();

	const isSelected = (loc) => {
		let color = '';
		if (location.includes(loc)) color = theme.palette.secondary.main;

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
				{adminRoutes.map(({ icon, name, path }) => {
					return (
						<ListItemButton
							key={path}
							selected={location.includes(path)}
							onClick={() => {
								navigate(path, { replace: true });
							}}
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
