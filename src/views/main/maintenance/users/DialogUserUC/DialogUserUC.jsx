// users/UserModal.jsx
import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	DialogContentText,
	TextField,
	Button,
	FormControlLabel,
	Switch,
	Stack,
	Grid,
	Divider,
	Typography,
	InputAdornment,
	IconButton,
	FormControl,
	Select,
	MenuItem,
	Box,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { Add, Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import { UserRoles } from '../../../../../utils/enums';
import useUser from '@views/main/maintenance/users/DialogUserUC/useUser';

const DialogUserUC = ({
	refetchUsers,
	userDialogStatus,
	closeUserDialog,
	openUserCreateDialog,
}) => {
	const theme = useTheme();
	const [visiblePassword, setVisiblePassword] = useState(false);
	const toggleVisiblePassword = () => setVisiblePassword((prev) => !prev);

	const {
		user,
		onCreate,
		onEdit,
		onOpen,
		onClose,
		isVisible,
		isEditable,
		handleInputUser,
		handleInputPhoneNumber,
	} = useUser(
		refetchUsers,
		userDialogStatus,
		closeUserDialog,
		openUserCreateDialog
	);

	return (
		<>
			<Button
				onClick={onOpen}
				startIcon={<Add />}
				sx={{ my: 12, minWidth: 150 }}
			>
				{useMediaQuery(theme.breakpoints.down('sm'))
					? 'Crear'
					: 'Crear usuario'}
			</Button>

			<Dialog open={isVisible} onClose={onClose} maxWidth={'xs'}>
				<DialogTitle>
					{isEditable ? 'Editar usuario' : 'Crear usuario'}
				</DialogTitle>
				<DialogContent>
					<Grid container>
						<Grid
							item
							xs={12}
							sm={isEditable ? 12 : 6}
							md={isEditable ? 12 : 5}
							sx={{ p: 4 }}
						>
							<Typography fontSize={12} fontWeight={500} ml={4}>
								Nombre de usuario
							</Typography>
							<TextField
								id='username'
								name='username'
								value={user.username}
								onChange={handleInputUser}
							/>
						</Grid>

						<Spoofer spoof={isEditable}>
							<Grid item xs={12} sm={6} md={7} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Contraseña
								</Typography>
								<TextField
									id={'password'}
									name={'password'}
									placeholder={'●●●●●'}
									type={!visiblePassword ? 'password' : 'text'}
									value={user.password}
									onChange={handleInputUser}
									InputProps={{
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													onClick={toggleVisiblePassword}
													edge='end'
													color={'primary'}
													sx={{ p: 6 }}
												>
													{!visiblePassword ? (
														<Visibility sx={{ width: 16, height: 16 }} />
													) : (
														<VisibilityOff sx={{ width: 16, height: 16 }} />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							</Grid>
						</Spoofer>

						<Grid item xs={12} sm={6} md={6} sx={{ p: 4 }}>
							<Typography fontSize={12} fontWeight={500} ml={4}>
								Nombre
							</Typography>
							<TextField
								id='firstName'
								name='firstName'
								value={user.firstName}
								onChange={handleInputUser}
							/>
						</Grid>

						<Grid item xs={12} sm={6} md={6} sx={{ p: 4 }}>
							<Typography fontSize={12} fontWeight={500} ml={4}>
								Apellido
							</Typography>
							<TextField
								id='lastName'
								name='lastName'
								value={user.lastName}
								onChange={handleInputUser}
							/>
						</Grid>

						<Grid item xs={12} sm={6} md={6} sx={{ p: 4 }}>
							<Typography fontSize={12} fontWeight={500} ml={4}>
								Número celular
							</Typography>
							<TextField
								id='phoneNumber'
								name='phoneNumber'
								value={user.phoneNumber}
								onChange={handleInputPhoneNumber}
								inputProps={{ inputMode: 'numeric' }}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>+52</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={6} sx={{ p: 4 }}>
							<Typography fontSize={12} fontWeight={500} ml={'4px'}>
								Rol
							</Typography>
							<FormControl>
								<Select
									id={'role'}
									name={'role'}
									value={user.role}
									onChange={handleInputUser}
								>
									{Object.entries(UserRoles).map((item) => (
										<MenuItem key={item[0]} value={item[0]}>
											{item[1]}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12} sx={{ p: 4 }}>
							<Typography fontSize={12} fontWeight={500} ml={4}>
								Email
							</Typography>
							<TextField
								id='email'
								name='email'
								value={user.email}
								onChange={handleInputUser}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant='text' onClick={onClose}>
						Cancelar
					</Button>
					<Button onClick={isEditable ? onEdit : onCreate}>
						{isEditable ? 'Actualizar' : 'Crear'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

const Spoofer = ({ children, spoof }) => (spoof ? <></> : children);

export default DialogUserUC;
