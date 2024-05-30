import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import cover from '@utils/images/4.png';
import { Fragment } from 'react';

const AuthLayout = () => {
	return (
		<Fragment>
			<Box
				sx={{
					display: 'flex',
					minHeight: '100svh',
					backgroundImage: `url(${cover})`,
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			>
				<Box
					sx={{
						width: '100%',
						bgcolor: '#00000020',
						display: 'flex',
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</Fragment>
	);
};

export default AuthLayout;
