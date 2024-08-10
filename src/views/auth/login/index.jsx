import {
	Box,
	IconButton,
	InputAdornment,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import TMRLogo from '@utils/logo/TMR_logo.svg';
import { Fragment } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useLogin from '@views/auth/login/useLogin';
import { LoadingButton } from '@mui/lab';

const TypographyWhite = (props) => <Typography color={'#FFFFFF'} {...props} />;

const Login = () => {
	const {
		credential,
		credentialInputChange,
		hidePassword,
		loading,
		login,
		toggleHide,
	} = useLogin();

	const onEnter = (e) => {
		if (credential.username && credential.password && e.key === 'Enter')
			login(e);
	};

	return (
		<Fragment>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '380px',
					maxWidth: '100%',
					mx: 'auto',
					backdropFilter: 'blur(8px)',
					borderRadius: 8,
					px: 32,
					my: 'auto',
					border: '2px solid #FFFFFF30',
					boxShadow: `0px 0px 2.3px -8px rgba(0, 0, 0, 0.207),
											0px 0px 5.4px -8px rgba(0, 0, 0, 0.299),
											0px 0px 9.7px -8px rgba(0, 0, 0, 0.368),
											0px 0px 16.1px -8px rgba(0, 0, 0, 0.432),
											0px 0px 26.5px -8px rgba(0, 0, 0, 0.501),
											0px 0px 46.2px -8px rgba(0, 0, 0, 0.593),
											0px 0px 100px -8px rgba(0, 0, 0, 0.8);
											`,
				}}
			>
				<TypographyWhite
					fontSize={26}
					fontWeight={700}
					mt={32}
					align={'center'}
				>
					¡Hola, bienvenido!
				</TypographyWhite>
				<TypographyWhite fontSize={16} fontWeight={500} align={'center'}>
					Inicia sesión
				</TypographyWhite>

				<TypographyWhite fontSize={12} fontWeight={500} mt={32} ml={4}>
					Nombre de usuario
				</TypographyWhite>
				<TextField
					id={'username'}
					name={'username'}
					placeholder={'usuario'}
					autoFocus
					fullWidth
					value={credential.username}
					onChange={credentialInputChange}
					onKeyDown={onEnter}
					margin={'dense'}
				/>

				<TypographyWhite fontSize={12} fontWeight={500} ml={4} mt={16}>
					Contraseña
				</TypographyWhite>
				<TextField
					margin={'dense'}
					id={'password'}
					name={'password'}
					placeholder={'●●●●●'}
					type={hidePassword ? 'password' : 'text'}
					fullWidth
					value={credential.password}
					onChange={credentialInputChange}
					onKeyDown={onEnter}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton onClick={toggleHide} edge='end' color={'primary'}>
									{hidePassword ? <Visibility /> : <VisibilityOff />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>

				<LoadingButton
					disabled={!(credential.username && credential.password)}
					loading={Boolean(loading)}
					onClick={login}
					sx={{
						mt: 48,
						mb: 32,
						'&.Mui-disabled': {
							backgroundColor: '#FFFFFF30',
						},
					}}
					variant={'contained'}
					color={'secondary'}
				>
					Iniciar Sesión
				</LoadingButton>

				<TypographyWhite fontSize={11} fontWeight={400} align='center' mb={8}>
					<Link
						color='inherit'
						href='https://www.tmr.com.mx'
						target='_blank'
						sx={{ textDecoration: 'none' }}
					>
						{'© '} TMR dev ❤️ {new Date().getFullYear()}
						<br />
						<img src={TMRLogo} alt={'TMR Logo'} height={12} />
					</Link>
				</TypographyWhite>
			</Box>
		</Fragment>
	);
};

export default Login;
