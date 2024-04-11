import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	Paper,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import TMRLogo from '@utils/logo/TMR_logo.svg';
import { Fragment, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoading } from '@providers/loading';
import { authClient } from '@utils/auth';
import { useSession } from '@providers/session';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import cover from '@utils/images/4.png';
import useLogin from '@views/auth/login/useLogin';
import { LoadingButton } from '@mui/lab';

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
			<img
				src={TMRLogo}
				alt={'TMR Logo'}
				height={55}
				style={{ margin: `32px auto 0px 16px` }}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					my: 'auto',
					width: '400px',
					maxWidth: '100%',
					mx: 'auto',
					// bgcolor: '#fff',
					borderRadius: 1,
					py: 3,
					pb: 5,
					px: 3,
				}}
			>
				<Typography fontSize={24} fontWeight={600}>
					¡Hola, bienvenido!
				</Typography>
				<Typography fontSize={16} fontWeight={500} color={'text.secondary'}>
					inicia sesión
				</Typography>

				<Box sx={{ display: 'flex', flexDirection: 'column', mt: '24px' }}>
					<Typography fontSize={12} fontWeight={500} ml={'4px'}>
						nombre de usuario
					</Typography>
					<TextField
						id={'username'}
						name={'username'}
						placeholder={'usuario'}
						autoFocus
						fullWidth
						value={credential.username}
						onChange={credentialInputChange}
						onKeyDown={onEnter}
					/>

					<Typography fontSize={12} fontWeight={500} ml={'4px'} mt={'16px'}>
						contraseña
					</Typography>
					<TextField
						id={'password'}
						name={'password'}
						placeholder={'contraseña'}
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
						sx={{ mt: '48px' }}
						variant={'contained'}
					>
						Iniciar Sesión
					</LoadingButton>
				</Box>
			</Box>
		</Fragment>
	);
};

export default Login;
