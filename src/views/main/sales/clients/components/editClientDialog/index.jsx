import PropTypes from 'prop-types';
import { useLoading } from '@providers/loading';
import { Fragment, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_CLIENT } from '@views/main/sales/clients/components/newClientDialog/requests';
import toast from 'react-hot-toast';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';

const InitialClientForm = {
	firstName: '',
	lastName: '',
	phoneNumber: '',
};

const EditClientDialog = ({ data }) => {
	const { setLoading } = useLoading();

	const [client, setClient] = useState(InitialClientForm);
	const [createClient] = useMutation(CREATE_CLIENT);
	const [isVisible, setIsVisible] = useState(false);

	const resetState = () => setClient(InitialClientForm);

	const toggleDialog = () => {
		setIsVisible(!isVisible);
		resetState();
	};
	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setClient({ ...client, [name]: value });
	};

	const handlePhoneChange = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setClient({ ...client, phoneNumber });
		} else {
			if (/^\d+$/.test(phoneNumber)) setClient({ ...client, phoneNumber });
		}
	};

	const check = () => {
		if (client.firstName === '') {
			toast('Nombre incompleto');
			return true;
		}

		if (client.lastName === '') {
			toast('Nombre incompleto');
			return true;
		}

		if (client.phoneNumber.length < 10) {
			toast('Número incompleto');
			return true;
		}

		if (
			client.addresses.formattedAddress &&
			!client.addresses.coordinates.length
		) {
			toast('Dirección incompleta');
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

		const clientAux = {
			firstName: client.firstName,
			lastName: client.lastName,
			phoneNumber: '+52' + client.phoneNumber,
		};

		createClient({ variables: { client: clientAux } })
			.then((res) => {
				if (!res.errors) {
					toast.success('Cliente guardado');
					toggleDialog();
					reloadClients();
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

	useEffect(() => {
		setLoading(true);
		if (data) {
			const { firstName, lastName, phoneNumber } = data;

			setClient({ ...client, firstName, lastName, phoneNumber });
		}
		setLoading(false);
	}, [data, isVisible]);

	return (
		<Fragment>
			<Button disableRipple onClick={toggleDialog}>
				Agregar Cliente
			</Button>

			<Dialog open={isVisible} onClose={toggleDialog} maxWidth={'xs'}>
				<DialogTitle>Nuevo cliente</DialogTitle>
				<DialogContent>
					<Typography variant={'caption'}>Contacto:</Typography>

					<Grid container columnSpacing={1}>
						<Grid item xs={12} sm>
							<TextField
								fullWidth
								id={'firstName'}
								name={'firstName'}
								label={'Nombre'}
								value={client.firstName}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={12} sm>
							<TextField
								fullWidth
								id={'lastName'}
								name={'lastName'}
								label={'Apellido'}
								value={client.lastName}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'phoneNumber'}
								name={'phoneNumber'}
								label={'Teléfono'}
								value={client.phoneNumber}
								onChange={handlePhoneChange}
								inputProps={{ maxLength: 10, inputMode: 'numeric' }}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>+52</InputAdornment>
									),
								}}
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

EditClientDialog.propTypes = {
	data: PropTypes.object,
};

export default EditClientDialog;
