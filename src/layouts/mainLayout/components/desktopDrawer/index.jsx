import PropTypes from 'prop-types';
import { Drawer, useTheme } from '@mui/material';
import { drawerWidth } from '@layouts/mainLayout';
import DrawerContent from '@layouts/mainLayout/components/drawerContent';
import { pxToRem } from '@config/theme/functions';

const DesktopDrawer = ({ open }) => {
	const theme = useTheme();

	return (
		<Drawer
			variant={'permanent'}
			open={open}
			sx={{
				'& .MuiDrawer-paper': {
					position: 'sticky',
					width: drawerWidth,
					height: `calc(100vh - 32px)`,
					top: pxToRem(16),
					borderRadius: pxToRem(16),
					margin: 2,
					border: 'none',
					whiteSpace: 'nowrap',
					boxSizing: 'border-box',
					backdropFilter: `saturate(200%) blur(1.875rem)`,
					backgroundColor: theme.palette.background.paper,
					boxShadow: `1px 1px 1px rgba(3, 7, 18, 0.01),
											2px 3px 3px rgba(3, 7, 18, 0.02),
											5px 6px 6px rgba(3, 7, 18, 0.03),
											9px 11px 11px rgba(3, 7, 18, 0.03),
											14px 17px 17px rgba(3, 7, 18, 0.04),
											20px 25px 25px rgba(3, 7, 18, 0.05);
											`,
					transition: (theme) =>
						theme.transitions.create('width', {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
					...(!open && {
						overflowX: 'hidden',
						width: (theme) => ({ sm: theme.spacing(7) }),
						transition: (theme) =>
							theme.transitions.create('width', {
								easing: theme.transitions.easing.sharp,
								duration: theme.transitions.duration.leavingScreen,
							}),
					}),
				},
			}}
		>
			<DrawerContent />
		</Drawer>
	);
};

DesktopDrawer.propTypes = {
	open: PropTypes.bool.isRequired,
	toggleDrawer: PropTypes.func.isRequired,
};

export default DesktopDrawer;
