import {
	AppBar,
	Avatar,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import {
	FoodBank,
	Hail,
	Inventory2,
	KeyboardArrowRight,
	Logout,
	MenuOpen,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { drawerWidth } from '@layouts/mainLayout';
import { useState } from 'react';
import { useSession } from '@providers/session';
import MobileDrawer from '@layouts/mainLayout/components/mobileDrawer';
import DesktopDrawer from '@layouts/mainLayout/components/desktopDrawer';
import CustomMenu from '@components/customMenu';

const TopBar = ({ open, toggleDrawer }) => {
	const theme = useTheme();
	const [anchorMenu, setAnchorMenu] = useState(null);
	const { logout, user } = useSession();

	const handleOpenMenu = (event) => {
		setAnchorMenu(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorMenu(null);
	};

	return (
		<AppBar
			position={'absolute'} // fixed
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
				transition: (theme) =>
					theme.transitions.create(['width', 'margin'], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen,
					}),
				...(open && {
					ml: { sm: drawerWidth },
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					transition: (theme) =>
						theme.transitions.create(['width', 'margin'], {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
				}),
				borderBottomRightRadius: (theme) => theme.shape.borderRadius,
			}}
		>
			<Toolbar sx={{ pr: '24px' }}>
				<IconButton sx={{ mr: 2 }} edge={'start'} onClick={toggleDrawer}>
					{open ? <MenuOpen /> : <KeyboardArrowRight />}
				</IconButton>

				<Typography
					variant={'h5'}
					fontWeight={'bold'}
					color={theme.palette.secondary.main}
					noWrap
					ml={'auto'}
				>
					{/*{useMediaQuery(theme.breakpoints.down('sm'))*/}
					{/*	? ''*/}
					{/*	: `${user?.firstName} ${user?.firstLastName}`}*/}
				</Typography>

				<Box sx={{ flexGrow: 0 }}>
					<Tooltip title={'Opciones'}>
						<IconButton onClick={handleOpenMenu}>
							<Avatar
								alt='userProfileImg'
								src={user.profileImg}
								sx={{ border: '3px solid #6a6a6a' }}
							/>
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
