import PropTypes from 'prop-types';
import { Drawer } from '@mui/material';
import { drawerWidth } from '@layouts/mainLayout';
import DrawerContent from '@layouts/mainLayout/components/drawerContent';
import shadows from '@config/theme/base/shadows';
import { pxToRem } from '@config/theme/functions';

const DesktopDrawer = ({ open }) => {
	const { xxl } = shadows;

	return (
		<Drawer
			variant={'permanent'}
			open={open}
			sx={{
				'& .MuiDrawer-paper': {
					borderRadius: 1,
					position: 'sticky',
					top: pxToRem(16),
					width: drawerWidth,
					height: `calc(100vh - 32px)`,
					margin: 2,
					border: 'none',
					whiteSpace: 'nowrap',
					boxSizing: 'border-box',
					boxShadow: xxl,
					backdropFilter: `saturate(20s0%) blur(1.875rem)`,
					backgroundColor: 'rgba(255,255,255,0.8)',
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
