import PropTypes from 'prop-types';
import { Dialog, Drawer } from '@mui/material';

const DrawerLeadReminder = ({ open, onClose }) => {
	return (
		<Drawer
			anchor={'right'}
			open={open}
			onClose={onClose}
			sx={{
				'& .MuiDrawer-paper': {
					width: 250,
					height: `calc(100vh - 32px)`,
					top: 16,
					borderTopLeftRadius: 16,
					borderBottomLeftRadius: 16,
					border: 'none',
					boxSizing: 'border-box',
				},
			}}
			slotProps={{
				backdrop: {
					sx: {
						// bgcolor: `${theme.palette.background.default}85`,
						backdropFilter: `blur(8px)`,
					},
				},
			}}
		></Drawer>
	);
};

DrawerLeadReminder.propTypes = {};

export default DrawerLeadReminder;
