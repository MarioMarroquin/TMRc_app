import PropTypes from 'prop-types';
import { Drawer } from '@mui/material';
import { drawerWidth } from '@layouts/mainLayout';
import DrawerContent from '@layouts/mainLayout/components/drawerContent';

const MobileDrawer = ({ open, toggleDrawer }) => {
	return (
		<Drawer
			variant={'temporary'}
			open={open}
			onClose={toggleDrawer}
			sx={{
				'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderBottomRightRadius: (theme) => theme.shape.borderRadius },
			}}
		>
			<DrawerContent toggleDrawer={toggleDrawer} />
		</Drawer>
	);
};

MobileDrawer.propTypes = {
	open: PropTypes.bool.isRequired,
	toggleDrawer: PropTypes.func.isRequired,
};

export default MobileDrawer;
