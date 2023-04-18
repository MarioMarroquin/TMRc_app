import {
	Autocomplete,
	Box,
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
import { useMutation } from '@apollo/client';
import { CREATE_CLIENT } from '@views/main/clients/components/newClientDialog/requests';
import { Fragment, useEffect, useState } from 'react';
import { useLoading } from '@providers/loading';
import DraggablePaper from '@components/draggablePaper';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import client from '@graphql';
import { LocationOn } from '@mui/icons-material';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { googleMapsApiKey } from '@config/environment';

const InitialClientForm = {
	firstName: '',
	lastName: '',
	phoneNumber: '',
	addresses: {
		alias: '',
		formattedAddress: '',
		info: '',
		coordinates: [],
	},
};

const NewClientDialog = ({ reloadClients }) => {
	const { setLoading } = useLoading();

	const [clientForm, setClientForm] = useState(InitialClientForm);
	const [createClient] = useMutation(CREATE_CLIENT);
	const [isVisible, setIsVisible] = useState(false);

	const {
		placesService,
		placePredictions,
		getPlacePredictions,
		isPlacePredictionsLoading,
	} = useGoogle({
		apiKey: googleMapsApiKey,
		options: {
			componentRestrictions: { country: 'mx' },
		},
	});

	const resetState = () => setClientForm(InitialClientForm);

	const toggleDialog = () => {
		setIsVisible(!isVisible);
		resetState();
	};
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

	const handleInputChangeAddressData = (e) => {
		const { name, value } = e.target;

		setClientForm({
			...clientForm,
			addresses: { ...clientForm.addresses, [name]: value },
		});
	};

	const handleInputChangeAddress = (event, value) => {
		getPlacePredictions({ input: value });

		let newAddress = { ...clientForm.addresses };

		const lastDescription = clientForm.addresses.formattedAddress;
		const actualCoordinates = clientForm.addresses.coordinates;

		if (!value) {
			newAddress = {
				...newAddress,
				formattedAddress: '',
				coordinates: [],
			};

			setClientForm({
				...clientForm,
				addresses: newAddress,
			});
		} else if (
			lastDescription.length > value.length ||
			(lastDescription.length < value.length && actualCoordinates.length)
		) {
			newAddress = {
				...newAddress,
				formattedAddress: value,
				coordinates: [],
			};

			setClientForm({
				...clientForm,
				addresses: newAddress,
			});
		} else {
			newAddress = { ...newAddress, formattedAddress: value };

			setClientForm({
				...clientForm,
				addresses: newAddress,
			});
		}
	};

	const handleInputOnChangeAddress = (event, value) => {
		let newAddress = { ...clientForm.addresses };

		if (!value) {
			newAddress = {
				...newAddress,
				formattedAddress: '',
				coordinates: [],
			};

			setClientForm({
				...clientForm,
				addresses: newAddress,
			});
		} else {
			let loc = [];
			placesService?.getDetails(
				{
					placeId: value.place_id,
					fields: ['geometry'],
				},
				(placeDetails) => {
					loc.push(placeDetails.geometry.location.lat());
					loc.push(placeDetails.geometry.location.lng());
				}
			);

			newAddress = {
				...newAddress,
				formattedAddress: value.description,
				coordinates: loc,
			};

			setClientForm({
				...clientForm,
				addresses: newAddress,
			});
		}
	};

	const check = () => {
		if (clientForm.firstName === '') {
			toast('Nombre incompleto');
			return true;
		}

		if (clientForm.lastName === '') {
			toast('Nombre incompleto');
			return true;
		}

		if (clientForm.phoneNumber.length < 10) {
			toast('Número incompleto');
			return true;
		}

		if (
			clientForm.addresses.formattedAddress &&
			!clientForm.addresses.coordinates.length
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
				fullWidth
			>
				<DialogTitle
					sx={{
						cursor: 'move',
					}}
				>
					Nuevo cliente
				</DialogTitle>
				<DialogContent>
					<Typography variant={'caption'}>Datos:</Typography>
					<Grid container spacing={2} py={1}>
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
					</Grid>

					<Typography variant={'caption'}>Adicional:</Typography>

					<Grid container spacing={2} py={2}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'alias'}
								name={'alias'}
								label={'Alias'}
								value={clientForm.addresses.alias}
								onChange={handleInputChangeAddressData}
							/>
						</Grid>
						<Grid item xs={12}>
							<Autocomplete
								freeSolo
								forcePopupIcon={true}
								options={placePredictions}
								getOptionLabel={(option) =>
									typeof option === 'string' ? option : option.description
								}
								autoComplete
								includeInputInList
								value={clientForm.addresses.formattedAddress}
								renderInput={(params) => (
									<TextField
										{...params}
										label={'Dirección'}
										multiline
										rows={2}
									/>
								)}
								loading={isPlacePredictionsLoading}
								onInputChange={handleInputChangeAddress}
								onChange={handleInputOnChangeAddress}
								renderOption={(props, option) => (
									<li {...props}>
										<Grid container alignItems='center'>
											<Grid item>
												<Box
													component={LocationOn}
													sx={{ color: 'text.secondary', mr: 2 }}
												/>
											</Grid>
											<Grid item xs>
												<Typography variant='body2' color='text.secondary'>
													{option.description}
												</Typography>
											</Grid>
										</Grid>
									</li>
								)}
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
