import { Box, Container, Link, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

function Copyright(props) {
	return (
		<Typography
			variant='body2'
			color='text.secondary'
			align='center'
			{...props}
		>
			{'Copyright © '}
			<Link color='inherit' href='https://www.tmr.com.mx'>
				Made with ❤️
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}
const AuthLayout = () => {
	return (
		<Box
			sx={{
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<Container maxWidth='xs' disableGutters>
				<Outlet />
			</Container>
			<Copyright />
		</Box>
	);
};

export default AuthLayout;
