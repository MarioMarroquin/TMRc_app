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
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const InitialLoginForm = {
	userName: '',
	password: '',
	expires: false,
};

const Login = () => {
	const theme = useTheme();
	const navigate = useNavigate();
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
				navigate('/home');
			});
		} catch (err) {
			toast.error('Revisa el correo y/o la contraseña');
			setLoading(false);
		}
	};

	const onEnter = (e) => {
		if (loginForm.userName && loginForm.password && e.key === 'Enter')
			onFinish(e);
	};

	return (
		<Box sx={{ p: 2 }}>
			<img src={TMRLogo} alt={'TMR Logo'} />

			<Paper sx={{ mt: 5, p: 3 }}>
				<Box
					sx={{
						backgroundColor: theme.palette.secondary.main,
						borderRadius: 1,
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
						onKeyDown={onEnter}
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
						onKeyDown={onEnter}
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

					<Button
						onClick={onFinish}
						disabled={!(loginForm.userName && loginForm.password)}
						sx={{ mx: 'auto', mt: 2, mb: 2 }}
					>
						Iniciar Sesión
					</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default Login;
