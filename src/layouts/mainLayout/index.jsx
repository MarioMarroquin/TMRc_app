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

const drawerWidth = 240;

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
			<TopBar open={open} toggleDrawer={toggleDrawer} />
			{useMediaQuery(themeAux.breakpoints.down('sm')) ? (
				<MobileDrawer open={open} toggleDrawer={toggleDrawer} />
			) : (
				<DesktopDrawer open={open} toggleDrawer={toggleDrawer} />
			)}
			<Box
				component={'main'}
				sx={{
					flexGrow: 1,
					height: '100vh',
					overflow: 'auto',
				}}
			>
				<Toolbar />
				<Container maxWidth={'lg'} sx={{ my: 4 }}>
					<Outlet />
				</Container>
			</Box>
		</Box>
	);
};

export { drawerWidth };
export default MainLayout;
