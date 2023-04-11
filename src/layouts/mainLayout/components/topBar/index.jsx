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
import { KeyboardArrowRight, Logout, MenuOpen } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { drawerWidth } from '@layouts/mainLayout';
import { useEffect, useState } from 'react';
import { useSession } from '@providers/session';
import CustomMenu from '@components/customMenu';
import { pxToRem } from '@config/theme/functions';
import colors from '@config/theme/base/colors';
import shadows from '@config/theme/base/shadows';

const TopBar = ({ open, toggleDrawer }) => {
	const theme = useTheme();
	const [anchorMenu, setAnchorMenu] = useState(null);
	const { logout, user } = useSession();
	const [transparent, setTransparent] = useState(true);

	const { navbarBoxShadow } = shadows;

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
				// ----------------------------------------------------------------
				// borderBottomRightRadius: (theme) => theme.shape.borderRadius,
				borderRadius: 1,
				boxShadow: transparent ? 'none' : navbarBoxShadow,
				top: 16,
				right: { xs: 16, sm: 24 },
				backdropFilter: `saturate(200%) blur(1.875rem)`,
				backgroundColor: transparent
					? `${colors.transparent.main} !important`
					: 'rgba(255,255,255,0.8)',
				// ----------------------------------------------------------------
				zIndex: 1200,
				width: (theme) => ({
					xs: `calc(100% - 30px)`,
					sm: `calc(100% - ${theme.spacing(7)} - 32px - 48px)`,
				}),
				transition: (theme) =>
					theme.transitions.create(['width', 'margin'], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen,
					}),
				...(open && {
					ml: { sm: drawerWidth },
					width: {
						xs: `calc(100% - 32px)`,
						sm: `calc(100% - ${drawerWidth}px - 32px - 48px)`,
					},
					transition: (theme) =>
						theme.transitions.create(['width', 'margin'], {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
				}),
			}}
		>
			<Toolbar sx={{ pr: pxToRem(24) }}>
				<IconButton sx={{ mr: 2 }} edge={'start'} onClick={toggleDrawer}>
					{open ? <MenuOpen /> : <KeyboardArrowRight />}
				</IconButton>

				<Typography
					variant={'h5'}
					fontWeight={'bold'}
					color={theme.palette.secondary.main}
					noWrap
					ml={'auto'}
				></Typography>

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
