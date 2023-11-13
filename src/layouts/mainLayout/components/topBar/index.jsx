import {
	AppBar,
	Avatar,
	Box,
	IconButton,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material';
import { Logout, ManageAccounts, Menu, MenuOpen } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { drawerWidth } from '@layouts/mainLayout';
import { useEffect, useState } from 'react';
import { useSession } from '@providers/session';
import CustomMenu from '@components/customMenu';
import { pxToRem } from '@config/theme/functions';
import CustomBreadcrumbs from '@components/customBreadcrumbs';

const TopBar = ({ open, toggleDrawer }) => {
	const theme = useTheme();
	const [anchorMenu, setAnchorMenu] = useState(null);
	const { logout, user } = useSession();
	const [transparent, setTransparent] = useState(true);

	const handleOpenMenu = (event) => {
		setAnchorMenu(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorMenu(null);
	};

	useEffect(() => {
		function handleTransparentNavbar() {
			if (window.scrollY !== 0) {
				setTransparent(false);
			} else {
				setTransparent(true);
			}
		}
		window.addEventListener('scroll', handleTransparentNavbar);

		return () => window.removeEventListener('scroll', handleTransparentNavbar);
	}, []);

	return (
		<AppBar
			position={'fixed'} // fixed
			sx={{
				top: 16,
				right: { xs: 16, sm: 24 },
				zIndex: 1200,
				borderRadius: pxToRem(16),
				backdropFilter: `saturate(200%) blur(20px)`,
				backgroundColor: transparent
					? `transparent !important`
					: `${theme.palette.background.paper}80`,
				boxShadow: 'none',
				// boxShadow: transparent
				// 	? 'none'
				// 	: ` 0px 0px 1px rgba(3, 7, 18, 0.10),
				// 			0px 2px 4px rgba(3, 7, 18, 0.10),
				// 			0px 4px 8px rgba(3, 7, 18, 0.10),
				// 			0px 6px 15px rgba(3, 7, 18, 0.10),
				// 			0px 10px 23px rgba(3, 7, 18, 0.10),
				// 			0px 14px 34px rgba(3, 7, 18, 0.10),
				// 			0px 19px 46px rgba(3, 7, 18, 0.10),
				// 			0px 25px 60px rgba(3, 7, 18, 0.10);
				// 			`,
				// ----------------------------------------------------------------
				width: {
					xs: `calc(100% - 32px)`,
					sm: `calc(100% - ${drawerWidth}px - 48px - 16px)`,
				},
				transition: (theme) =>
					theme.transitions.create(['width', 'margin'], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen,
					}),
			}}
		>
			<Toolbar sx={{ pr: pxToRem(24) }}>
				<IconButton
					sx={{ mr: 2, display: { xs: 'flex', sm: 'none' } }}
					edge={'start'}
					onClick={toggleDrawer}
				>
					{open ? <MenuOpen /> : <Menu />}
				</IconButton>

				<CustomBreadcrumbs />

				<Typography
					color={theme.palette.secondary.main}
					noWrap
					ml={'auto'}
					mr={2}
				>
					{user.userName}
				</Typography>

				<Box sx={{ flexGrow: 0 }}>
					<Tooltip title={'Opciones'}>
						<IconButton onClick={handleOpenMenu}>
							<Avatar alt='userProfileImg'>
								<ManageAccounts />
							</Avatar>
						</IconButton>
					</Tooltip>
					<CustomMenu
						anchorEl={anchorMenu}
						open={Boolean(anchorMenu)}
						onClose={handleCloseMenu}
					>
						<MenuItem key={1} onClick={logout} disableRipple>
							<Logout />
							Cerrar Sesión
						</MenuItem>
					</CustomMenu>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

TopBar.propTypes = {
	open: PropTypes.bool.isRequired,
	toggleDrawer: PropTypes.func.isRequired,
};
export default TopBar;

// import {
// 	AppBar,
// 	Avatar,
// 	Box,
// 	IconButton,
// 	MenuItem,
// 	Toolbar,
// 	Tooltip,
// 	Typography,
// 	useTheme,
// } from '@mui/material';
// import { Logout, ManageAccounts, Menu, MenuOpen } from '@mui/icons-material';
// import PropTypes from 'prop-types';
// import { drawerWidth } from '@layouts/mainLayout';
// import { useEffect, useState } from 'react';
// import { useSession } from '@providers/session';
// import CustomMenu from '@components/customMenu';
// import { pxToRem } from '@config/theme/functions';
// import CustomBreadcrumbs from '@components/customBreadcrumbs';
//
// const TopBar = ({ open, toggleDrawer }) => {
// 	const theme = useTheme();
// 	const [anchorMenu, setAnchorMenu] = useState(null);
// 	const { logout, user } = useSession();
// 	const [transparent, setTransparent] = useState(true);
//
// 	const handleOpenMenu = (event) => {
// 		setAnchorMenu(event.currentTarget);
// 	};
//
// 	const handleCloseMenu = () => {
// 		setAnchorMenu(null);
// 	};
//
// 	useEffect(() => {
// 		function handleTransparentNavbar() {
// 			if (window.scrollY !== 0) {
// 				setTransparent(false);
// 			} else {
// 				setTransparent(true);
// 			}
// 		}
// 		window.addEventListener('scroll', handleTransparentNavbar);
//
// 		return () => window.removeEventListener('scroll', handleTransparentNavbar);
// 	}, []);
//
// 	return (
// 		<AppBar
// 			position={'fixed'} // fixed
// 			sx={{
// 				top: 16,
// 				right: { xs: 16, sm: 24 },
// 				zIndex: 1200,
// 				borderRadius: pxToRem(16),
// 				backdropFilter: `saturate(200%) blur(20px)`,
// 				backgroundColor: transparent
// 					? `transparent !important`
// 					: `${theme.palette.background.paper}80`,
// 				boxShadow: transparent
// 					? 'none'
// 					: ` 0px 0px 1px rgba(3, 7, 18, 0.10),
// 							0px 2px 4px rgba(3, 7, 18, 0.10),
// 							0px 4px 8px rgba(3, 7, 18, 0.10),
// 							0px 6px 15px rgba(3, 7, 18, 0.10),
// 							0px 10px 23px rgba(3, 7, 18, 0.10),
// 							0px 14px 34px rgba(3, 7, 18, 0.10),
// 							0px 19px 46px rgba(3, 7, 18, 0.10),
// 							0px 25px 60px rgba(3, 7, 18, 0.10);
// 							`,
// 				// ----------------------------------------------------------------
// 				width: (theme) => ({
// 					xs: `calc(100% - 32px)`,
// 					sm: `calc(100% - ${theme.spacing(8)} - 48px - 16px)`,
// 				}),
// 				transition: (theme) =>
// 					theme.transitions.create(['width', 'margin'], {
// 						easing: theme.transitions.easing.sharp,
// 						duration: theme.transitions.duration.leavingScreen,
// 					}),
// 				...(open && {
// 					ml: { sm: drawerWidth },
// 					width: {
// 						xs: `calc(100% - 32px)`,
// 						sm: `calc(100% - ${drawerWidth}px - 48px - 16px)`,
// 					},
// 					transition: (theme) =>
// 						theme.transitions.create(['width', 'margin'], {
// 							easing: theme.transitions.easing.sharp,
// 							duration: theme.transitions.duration.enteringScreen,
// 						}),
// 				}),
// 			}}
// 		>
// 			<Toolbar sx={{ pr: pxToRem(24) }}>
// 				<IconButton sx={{ mr: 2 }} edge={'start'} onClick={toggleDrawer}>
// 					{open ? <MenuOpen /> : <Menu />}
// 				</IconButton>
//
// 				<CustomBreadcrumbs />
//
// 				<Typography
// 					color={theme.palette.secondary.main}
// 					noWrap
// 					ml={'auto'}
// 					mr={2}
// 				>
// 					{user.userName}
// 				</Typography>
//
// 				<Box sx={{ flexGrow: 0 }}>
// 					<Tooltip title={'Opciones'}>
// 						<IconButton onClick={handleOpenMenu}>
// 							<Avatar alt='userProfileImg'>
// 								<ManageAccounts />
// 							</Avatar>
// 						</IconButton>
// 					</Tooltip>
// 					<CustomMenu
// 						anchorEl={anchorMenu}
// 						open={Boolean(anchorMenu)}
// 						onClose={handleCloseMenu}
// 					>
// 						<MenuItem key={1} onClick={logout} disableRipple>
// 							<Logout />
// 							Cerrar Sesión
// 						</MenuItem>
// 					</CustomMenu>
// 				</Box>
// 			</Toolbar>
// 		</AppBar>
// 	);
// };
//
// TopBar.propTypes = {
// 	open: PropTypes.bool.isRequired,
// 	toggleDrawer: PropTypes.func.isRequired,
// };
// export default TopBar;
