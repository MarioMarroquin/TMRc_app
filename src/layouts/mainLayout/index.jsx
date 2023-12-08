import { useState } from 'react';
import {
	Box,
	Container,
	Toolbar,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import TopBar from './components/topBar';
import MobileDrawer from '@layouts/mainLayout/components/mobileDrawer';
import DesktopDrawer from '@layouts/mainLayout/components/desktopDrawer';
import { pxToRem } from '@config/theme/functions';

const drawerWidth = 200;

const MainLayout = () => {
	const themeAux = useTheme();
	const [open, setOpen] = useState(false);
	const toggleDrawer = () => setOpen(!open);

	return (
		<Box
			sx={{
				display: 'flex',
			}}
		>
			<TopBar open={true} toggleDrawer={toggleDrawer} />
			{useMediaQuery(themeAux.breakpoints.down('sm')) ? (
				<MobileDrawer open={open} toggleDrawer={toggleDrawer} />
			) : (
				<DesktopDrawer open toggleDrawer={toggleDrawer} />
			)}
			<Box
				component={'main'}
				sx={{
					flexGrow: 1,
					overflow: 'auto',
				}}
			>
				<Toolbar sx={{ mt: pxToRem(16) }} />
				<Container disableGutters maxWidth={'xl'}>
					<Outlet />
				</Container>
			</Box>
		</Box>
	);
};

export { drawerWidth };
export default MainLayout;
