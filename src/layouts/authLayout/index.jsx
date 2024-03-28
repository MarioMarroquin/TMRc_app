import { Box, Container, Link, Typography, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import cover from '@utils/images/4.png';

function Copyright(props) {
	return (
		<Typography
			fontSize={12}
			fontWeight={400}
			align='center'
			mt={'auto'}
			mb={'24px'}
			{...props}
		>
			<Link
				color='inherit'
				href='https://www.tmr.com.mx'
				target='_blank'
				sx={{ textDecoration: 'none' }}
			>
				{'© '} TMR dev ❤️ {new Date().getFullYear()}
			</Link>
		</Typography>
	);
}

const AuthLayout = () => {
	return (
		<Box>
			<Box
				sx={(theme) => ({
					width: 'clamp(100vw - 50vw, (769px - 100vw) * 999, 100vw)',
					transition: 'width 0.4s',
					transitionDelay: 'calc(0.4s + 0.1s)',
					position: 'relative',
					zIndex: 1,
					display: 'flex',
					justifyContent: 'flex-end',
					backdropFilter: 'blur(8px)',
					backgroundColor: 'rgba(255,255,255,0.65)',
				})}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						minHeight: '100dvh',
						width: 'clamp(800px, (769px - 100vw) * 999, 100%)',
						maxWidth: '100%',
						px: 2,
					}}
				>
					<Outlet />
					<Copyright />
				</Box>
			</Box>

			<Box
				sx={(theme) => ({
					height: '100%',
					position: 'fixed',
					right: 0,
					top: 0,
					bottom: 0,
					left: 'clamp(0px, (100vw - 769px) * 999, 100vw - 50vw)',
					transition: 'background-image 0.4s, left 0.4s !important',
					transitionDelay: 'calc(0.4s + 0.1s)',
					backgroundColor: '#F0F4F8',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					backgroundImage: `url(${cover})`,
				})}
			/>
		</Box>
	);
};

export default AuthLayout;
