import PropTypes from 'prop-types';
import { Drawer, useTheme } from '@mui/material';
import { drawerWidth } from '@layouts/mainLayout';
import DrawerContent from '@layouts/mainLayout/components/drawerContent';
import { pxToRem } from '@config/theme/functions';

const DesktopDrawer = (props) => {
	const theme = useTheme();

	return (
		<Drawer
			variant={'permanent'}
			sx={{
				'& .MuiDrawer-paper': {
					position: 'sticky',
					width: drawerWidth,
					height: `calc(100vh)`,
					// height: `calc(100vh - 32px)`,
					// top: pxToRem(16),
					// borderRadius: pxToRem(16),
					marginRight: 12,
					border: 'none',
					whiteSpace: 'nowrap',
					boxSizing: 'border-box',
					backdropFilter: `saturate(200%) blur(1.875rem)`,
					backgroundColor: theme.palette.background.default,
					// backgroundColor: 'unset',

					transition: (theme) =>
						theme.transitions.create('width', {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
					// ...(!open && {
					// 	overflowX: 'hidden',
					// 	width: (theme) => ({ sm: theme.spacing(8) }),
					// 	transition: (theme) =>
					// 		theme.transitions.create('width', {
					// 			easing: theme.transitions.easing.sharp,
					// 			duration: theme.transitions.duration.leavingScreen,
					// 		}),
					// }),
				},
			}}
		>
			<DrawerContent />
		</Drawer>
	);
};

export default DesktopDrawer;
