import PropTypes from 'prop-types';
import { Drawer } from '@mui/material';
import { drawerWidth } from '@layouts/mainLayout';
import DrawerContent from '@layouts/mainLayout/components/drawerContent';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MobileDrawer = ({ open, toggleDrawer }) => {
	const location = useLocation().pathname;

	useEffect(() => {
		if (open) toggleDrawer();
	}, [location]);

	return (
		<Drawer
			variant={'temporary'}
			open={open}
			onClose={toggleDrawer}
			sx={{
				'& .MuiDrawer-paper': {
					borderRadius: 1,
					boxSizing: 'border-box',
					width: drawerWidth,
					height: `calc(100vh - 48px)`,
					margin: 3, // 8 px unit
					zIndex: 1500,
				},
			}}
		>
			<DrawerContent />
		</Drawer>
	);
};

MobileDrawer.propTypes = {
	open: PropTypes.bool.isRequired,
	toggleDrawer: PropTypes.func.isRequired,
};

export default MobileDrawer;
