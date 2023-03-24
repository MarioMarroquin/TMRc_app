import PropTypes from 'prop-types';
import { Drawer } from '@mui/material';
import { drawerWidth } from '@layouts/mainLayout';
import DrawerContent from '@layouts/mainLayout/components/drawerContent';

const DesktopDrawer = ({ open, toggleDrawer }) => {
	return (
		<Drawer
			variant={'permanent'}
			open={open}
			sx={{
				'& .MuiDrawer-paper': {
					borderRight: 0,
					position: 'relative',
					whiteSpace: 'nowrap',
					width: drawerWidth,
					transition: (theme) =>
						theme.transitions.create('width', {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
					boxSizing: 'border-box',
					...(!open && {
						overflowX: 'hidden',
						transition: (theme) =>
							theme.transitions.create('width', {
								easing: theme.transitions.easing.sharp,
								duration: theme.transitions.duration.leavingScreen,
							}),
						width: (theme) => ({ sm: theme.spacing(7) }),
					}),
					borderBottomRightRadius: (theme) => theme.shape.borderRadius,
				},
			}}
		>
			<DrawerContent toggleDrawer={toggleDrawer} />
		</Drawer>
	);
};

DesktopDrawer.propTypes = {
	open: PropTypes.bool.isRequired,
	toggleDrawer: PropTypes.func.isRequired,
};

export default DesktopDrawer;
