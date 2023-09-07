import PropTypes from 'prop-types';
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
import { LocationOn } from '@mui/icons-material';
import { useLoading } from '@providers/loading';
import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import companies from '@views/main/sales/companies';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { googleMapsApiKey } from '@config/environment';
import { useMutation } from '@apollo/client';
import { UPDATE_COMPANY } from '@views/main/sales/companies/components/editCompanyDialog/requests';

const InitialCompany = {
	id: '',
	name: '',
	phoneNumber: '',
	website: '',
	email: '',
	addresses: {
		alias: '',
		formattedAddress: '',
		info: '',
		coordinates: [],
	},
};

const EMAIL =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;

const WEBSITE =
	/^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const EditCompanyDialog = ({ data, reloadCompanies }) => {
	const { setLoading } = useLoading();
	const [company, setCompany] = useState(InitialCompany);
	const [isVisible, setIsVisible] = useState(false);

	const [updateCompany] = useMutation(UPDATE_COMPANY);

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

	const resetState = () => setCompany(InitialCompany);

	const toggleDialog = () => {
		setIsVisible((prevState) => !prevState);
		resetState();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setCompany({ ...company, [name]: value });
	};

	const handlePhoneChange = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setCompany({ ...company, phoneNumber });
		} else {
			if (/^\d+$/.test(phoneNumber)) setCompany({ ...company, phoneNumber });
		}
	};

	const handleInputChangeAddressData = (e) => {
		const { name, value } = e.target;

		setCompany({
			...company,
			addresses: { ...companies.addresses, [name]: value },
		});
	};

	const handleInputChangeAddress = (event, value) => {
		getPlacePredictions({ input: value });

		let newAddress = { ...company.addresses };

		const lastDescription = company.addresses.formattedAddress;
		const actualCoordinates = company.addresses.coordinates;

		if (!value) {
			newAddress = {
				...newAddress,
				formattedAddress: '',
				coordinates: [],
			};

			setCompany({
				...company,
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

			setCompany({
				...company,
				addresses: newAddress,
			});
		} else {
			newAddress = { ...newAddress, formattedAddress: value };

			setCompany({
				...company,
				addresses: newAddress,
			});
		}
	};

	const handleInputOnChangeAddress = (event, value) => {
		let newAddress = { ...company.addresses };

		if (!value) {
			newAddress = {
				...newAddress,
				formattedAddress: '',
				coordinates: [],
			};

			setCompany({
				...company,
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

			setCompany({
				...company,
				addresses: newAddress,
			});
		}
	};
	const check = () => {
		if (company.name === '') {
			toast('Nombre faltante');
			return true;
		}

		if (company.phoneNumber.length < 10 && company.phoneNumber) {
			toast('Número incompleto');
			return true;
		}

		if (company.email && !EMAIL.test(company.email)) {
			toast('Correo incorrecto');
			return true;
		}

		if (company.website && !WEBSITE.test(company.website)) {
			toast('URL incorrecta');
			return true;
		}

		if (
			company.addresses.formattedAddress &&
			!company.addresses.coordinates.length
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

		const companyObj = {
			name: company.name,
			phoneNumber: company.phoneNumber,
			website: company.website,
			email: company.email,
		};

		updateCompany({ variables: { companyId: company.id, company: companyObj } })
			.then((res) => {
				if (!res.errors) {
					toast.success('Compañía guardada');
					toggleDialog();
					reloadCompanies();
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

	// useEffect(() => {
	// 	if (data) {
	// 		const aux = {}
	//
	// 		setCompany(aux)}
	// 	}
	// }, [])

	return (
		<Fragment>
			<Button sx={{ ml: 'auto' }} disableRipple onClick={toggleDialog}>
				Editar compañía
			</Button>

			<Dialog open={isVisible} onClose={toggleDialog} maxWidth={'xs'}>
				<DialogTitle>Nueva compañía</DialogTitle>
				<DialogContent>
					<Grid container columnSpacing={1}>
						<Grid item>
							<TextField
								fullWidth
								id={'name'}
								name={'name'}
								label={'Nombre'}
								value={company.name}
								onChange={handleInputChange}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'phoneNumber'}
								name={'phoneNumber'}
								label={'Teléfono'}
								value={company.phoneNumber}
								onChange={handlePhoneChange}
								inputProps={{ maxLength: 10, inputMode: 'numeric' }}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>+52</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								id={'email'}
								name={'email'}
								label={'Correo electrónico'}
								value={company.email}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								id={'website'}
								name={'website'}
								label={'Sitio web'}
								value={company.website}
								onChange={handleInputChange}
							/>
						</Grid>
					</Grid>

					<Typography variant={'caption'}>Contacto:</Typography>

					<Grid container>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'alias'}
								name={'alias'}
								label={'Alias'}
								value={company.addresses.alias}
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
								value={company.addresses.formattedAddress}
								renderInput={(params) => (
									<TextField
										{...params}
										label={'Dirección'}
										multiline
										rows={2}
										fullWidth
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

						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								rows={2}
								id={'info'}
								name={'info'}
								label={'Info'}
								value={company.addresses.info}
								onChange={handleInputChangeAddressData}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={onFinish}>Guardar</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

EditCompanyDialog.propTypes = {
	data: PropTypes.object,
	reloadCompanies: PropTypes.func,
};

export default EditCompanyDialog;
