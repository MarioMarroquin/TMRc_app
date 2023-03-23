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
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoading } from '@providers/loading';
import { authClient } from '@utils/auth';
import { useSession } from '@providers/session';

const InitialLoginForm = {
	userName: '',
	password: '',
	expires: false,
};

const Login = () => {
	const theme = useTheme();
	const { setIsLogged } = useSession();

	const { setLoading } = useLoading();

	const [showPassword, setShowPassword] = useState(false);
	const [loginForm, setLoginForm] = useState(InitialLoginForm);

	const toggleVisibility = () => setShowPassword((show) => !show);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setLoginForm({ ...loginForm, [name]: value });
	};

	const onFinish = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await authClient.post('/login', loginForm).then((res) => {
				setIsLogged(true);
				setLoading(false);
			});
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ p: 2 }}>
			<img src={TMRLogo} alt={'TMR Logo'} />

			<Paper sx={{ mt: 5, p: 3 }}>
				<Box
					sx={{
						backgroundColor: theme.palette.secondary.main,
						borderRadius: '8px',
						marginTop: -5,
						boxShadow: 10,
						color: 'white',
						padding: 4,
						marginBottom: 3,
					}}
				>
					<Typography align={'center'} variant={'h4'}>
						Inicio de sesión
					</Typography>
					<Typography align={'center'}>
						Introduce tus datos para iniciar sesión
					</Typography>
				</Box>

				<Box display={'flex'} flexDirection={'column'}>
					<TextField
						id={'userName'}
						name={'userName'}
						label={'Usuario'}
						margin={'normal'}
						autoFocus
						fullWidth
						value={loginForm.userName}
						onChange={handleInputChange}
						onKeyDown={(e) => {
							if (e.key === 'Enter') onFinish(e);
						}}
					/>
					<TextField
						id={'password'}
						name={'password'}
						label={'Contraseña'}
						margin={'normal'}
						type={showPassword ? 'text' : 'password'}
						fullWidth
						value={loginForm.password}
						onChange={handleInputChange}
						onKeyDown={(e) => {
							if (e.key === 'Enter') onFinish(e);
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton onClick={toggleVisibility} edge='end'>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<Button onClick={null} sx={{ mx: 'auto', mt: 2, mb: 2 }}>
						Iniciar Sesión
					</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default Login;
