import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	InputAdornment,
	TextField,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { CREATE_CLIENT } from '@views/main/clients/components/newClientDialog/requests';
import { Fragment, useState } from 'react';
import { useLoading } from '@providers/loading';
import DraggablePaper from '@components/draggablePaper';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

const InitialClientForm = {
	firstName: '',
	lastName: '',
	phoneNumber: '',
};

const NewClientDialog = ({ reloadClients }) => {
	const { setLoading } = useLoading();

	const [clientForm, setClientForm] = useState(InitialClientForm);
	const [createClient] = useMutation(CREATE_CLIENT);
	const [isVisible, setIsVisible] = useState(false);

	const toggleDialog = () => setIsVisible(!isVisible);
	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setClientForm({ ...clientForm, [name]: value });
	};

	const handlePhoneChange = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setClientForm({ ...clientForm, phoneNumber });
		} else {
			if (/^\d+$/.test(phoneNumber))
				setClientForm({ ...clientForm, phoneNumber });
		}
	};

	const check = () => {
		if (clientForm.firstName === '') {
			toast('Nombre faltante');
			return true;
		}

		if (clientForm.lastName === '') {
			toast('Nombre faltante');
			return true;
		}

		if (clientForm.phoneNumber.length < 10) {
			toast('Número faltante');
			return true;
		}

		return false;
	};
	const onFinish = (e) => {
		e.preventDefault();

		setLoading(true);

		if (check()) {
			setLoading(false);
			return;
		}

		const client = {
			firstName: clientForm.firstName,
			lastName: clientForm.lastName,
			phoneNumber: '+52' + clientForm.phoneNumber,
		};

		createClient({ variables: { client } })
			.then((res) => {
				if (!res.errors) {
					toast.success('Cliente guardado');
					toggleDialog();
					reloadClients();
					setClientForm(InitialClientForm);
				} else {
					console.log('Errores', res.errors);
					toast.error('Error al guardar');
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	return (
		<Fragment>
			<Button disableRipple onClick={toggleDialog}>
				Agregar Cliente
			</Button>

			<Dialog
				open={isVisible}
				onClose={toggleDialog}
				PaperComponent={DraggablePaper}
				aria-labelledby={'dialogTitleDrag'}
			>
				<DialogTitle
					sx={{
						cursor: 'move',
					}}
				>
					Nuevo cliente
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={2} pt={1}>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								id={'firstName'}
								name={'firstName'}
								label={'Nombre'}
								value={clientForm.firstName}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								id={'lastName'}
								name={'lastName'}
								label={'Apellido'}
								value={clientForm.lastName}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'phoneNumber'}
								name={'phoneNumber'}
								label={'Teléfono'}
								value={clientForm.phoneNumber}
								onChange={handlePhoneChange}
								inputProps={{ maxLength: 10, inputMode: 'numeric' }}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>+52</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'address'}
								name={'address'}
								label={'Dirección'}
								value={null}
								onChange={null}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'details'}
								name={'details'}
								label={'Detalles'}
								value={null}
								onChange={null}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={onFinish}>Registrar</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

NewClientDialog.propTypes = {
	reloadClients: PropTypes.func,
};

export default NewClientDialog;
