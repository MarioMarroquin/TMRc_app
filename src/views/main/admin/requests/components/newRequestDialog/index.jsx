import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import {
	Autocomplete,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	Grid,
	InputAdornment,
	MenuItem,
	Select,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { ServiceType } from '@utils/enums';
import { HomeWork, Person } from '@mui/icons-material';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
	CREATE_REQUEST,
	GET_BRANDS,
	GET_CLIENTS,
	GET_COMPANIES,
	GET_SELLERS,
} from './requests';
import useDebounce from '@hooks/use-debounce';
import { useLoading } from '@providers/loading';
import toast from 'react-hot-toast';
import CustomDate from '@components/customDate';
import CustomTime from '@components/customTime';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const InitialRequest = {
	requestDate: new Date(),
	serviceType: '',
	contactMedium: '',
	advertisingMedium: '',
	productStatus: '',
	comments: '',
	extraComments: '',
	requestStatus: 'PENDING',
	isSale: null,
};

const InitialBrand = {
	id: undefined, // " "
	name: '',
};

const InitialCompany = {
	id: undefined,
	name: '',
	phoneNumber: '',
	email: '',
};

const InitialClient = {
	id: undefined,
	firstName: '',
	lastName: '',
	phoneNumber: '',
	email: '',
	get name() {
		return (this.firstName + ' ' + this.lastName).trim();
	},
};

const InitialSeller = {
	id: undefined,
	firstName: '',
	lastName: '',
	get name() {
		return (this.firstName + ' ' + this.lastName).trim();
	},
};

const NewRequestDialog = ({ refetchRequests }) => {
	const theme = useTheme();
	const { setLoading } = useLoading();
	const [request, setRequest] = useState(InitialRequest);
	const [isVisible, setIsVisible] = useState(false);
	const toggleDialog = () => setIsVisible((prev) => !prev);

	const handleDateChange = (requestDate) => {
		setRequest({ ...request, requestDate });
	};

	const handleTimeChange = (time) => {
		const auxTime = time.split(':');
		const requestDate = request.requestDate;
		requestDate.setHours(auxTime[0], auxTime[1], 0);
		setRequest({ ...request, requestDate });
	};

	// CLIENTES
	const [searchedClients, setSearchedClients] = useState([]);
	const [client, setClient] = useState(InitialClient);
	const [searchClients, { loading }] = useLazyQuery(GET_CLIENTS);
	const debouncedClient = useDebounce(client.firstName, 700);

	// fetch data from server CLIENTS
	useEffect(() => {
		searchClients({ variables: { text: client.firstName } }).then((res) => {
			if (!res.error) {
				const aux = res.data.searchClients.results;
				setSearchedClients(aux);
			} else {
				console.log(res.error);
			}
		});
	}, [debouncedClient]);

	const handleInputOnChangeClient = (event, value) => {
		if (!value) {
			setClient({
				...client,
				id: undefined,
				firstName: '',
				lastName: '',
				phoneNumber: '',
				email: '',
			});
		} else {
			setClient({
				...client,
				id: value.id,
				firstName: value.firstName,
				lastName: value.lastName,
				phoneNumber: value.phoneNumber,
				email: value.email,
			});
		}
	};

	const handleInputChangeClient = (event, value) => {
		const actualId = client.id;
		const lastName = client.name;

		if (!value) {
			setClient({
				...client,
				id: undefined,
				firstName: '',
				lastName: '',
			});
		} else if (
			lastName.length > value.length ||
			(lastName.length < value.length && actualId)
		) {
			setClient({
				...client,
				id: undefined,
				firstName: value,
				lastName: '',
			});
		} else {
			setClient({
				...client,
				firstName: value,
			});
		}
	};

	const handlePhoneChangeClient = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setClient({ ...client, phoneNumber });
		} else {
			if (/^\d+$/.test(phoneNumber)) setClient({ ...client, phoneNumber });
		}
	};

	const handleEmailChangeClient = (e) => {
		const email = e.target.value;

		setClient({ ...client, email });
	};

	// SELLERS
	const [searchedSellers, setSearchedSellers] = useState([]);
	const [seller, setSeller] = useState(InitialSeller);
	const [searchSellers, { loading: loadingSellers }] =
		useLazyQuery(GET_SELLERS);
	const debouncedSeller = useDebounce(seller.firstName, 700);

	// fetch data from server CLIENTS
	useEffect(() => {
		searchSellers({ variables: { text: seller.firstName } }).then((res) => {
			if (!res.error) {
				const aux = res.data.searchSellers.results;
				setSearchedSellers(aux);
			} else {
				console.log(res.error);
			}
		});
	}, [debouncedSeller]);

	const handleInputOnChangeSeller = (event, value) => {
		event.preventDefault();

		console.log('onchange entra: ', value);

		if (!value) {
			setSeller({
				...seller,
				id: undefined,
				firstName: '',
				lastName: '',
			});
		} else {
			setSeller({
				...seller,
				id: value.id,
				firstName: value.firstName,
				lastName: value.lastName,
			});
		}

		console.log('onchange sale: ', value);
	};

	const handleInputChangeSeller = (event, value) => {
		const actualId = seller.id;
		const lastName = seller.firstName + ' ' + seller.lastName;

		if (!value) {
			setSeller({
				...seller,
				id: undefined,
				firstName: '',
				lastName: '',
			});
		} else if (
			lastName.length > value.length ||
			(lastName.length < value.length && actualId)
		) {
			setSeller({
				...seller,
				id: undefined,
				firstName: value,
				lastName: '',
			});
		} else {
			setSeller({
				...seller,
				firstName: value,
			});
		}
	};

	// COMPANY
	const [searchedCompanies, setSearchedCompanies] = useState([]);
	const [company, setCompany] = useState(InitialCompany);
	const [searchCompanies, { loading: loadingCompanies }] =
		useLazyQuery(GET_COMPANIES);
	const debouncedCompany = useDebounce(company.name, 700);

	// fetch data from server COMPANIES
	useEffect(() => {
		searchCompanies({ variables: { text: company.name } }).then((res) => {
			if (!res.error) {
				const aux = res.data.searchCompanies.results;
				setSearchedCompanies(aux);
			} else {
				console.log(res.error);
			}
		});
	}, [debouncedCompany]);

	const handleInputOnChangeCompany = (event, value) => {
		if (!value) {
			setCompany({
				...company,
				id: undefined,
				name: '',
				phoneNumber: '',
				email: '',
			});
		} else {
			setCompany({
				...company,
				id: value.id,
				name: value.name,
				phoneNumber: value.phoneNumber,
				email: value.email,
			});
		}
	};

	const handleInputChangeCompany = (event, value) => {
		const actualId = company.id;
		const lastName = company.name;

		if (!value) {
			setCompany({
				...company,
				id: undefined,
				name: '',
			});
		} else if (
			lastName.length > value.length ||
			(lastName.length < value.length && actualId)
		) {
			setCompany({
				...company,
				id: undefined,
				name: value,
			});
		} else {
			setCompany({
				...company,
				name: value,
			});
		}
	};

	const handlePhoneChangeCompany = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setCompany({ ...company, phoneNumber });
		} else {
			if (/^\d+$/.test(phoneNumber)) setCompany({ ...company, phoneNumber });
		}
	};

	const handleEmailChangeCompany = (e) => {
		const email = e.target.value;

		setCompany({ ...company, email });
	};

	// BRANDS
	const [searchedBrands, setSearchedBrands] = useState([]);
	const [brand, setBrand] = useState(InitialBrand);
	const [searchBrands, { loading: loadingBrands }] = useLazyQuery(GET_BRANDS);
	const debouncedBrand = useDebounce(brand.name, 700);

	useEffect(() => {
		searchBrands({ variables: { text: brand.name } }).then((res) => {
			if (!res.error) {
				const aux = res.data.searchBrands.results;
				setSearchedBrands(aux);
			} else {
				console.log(res.error);
			}
		});
	}, [debouncedBrand]);

	const handleInputOnChangeBrand = (event, value) => {
		if (!value) {
			setBrand({
				...brand,
				id: undefined,
				name: '',
			});
		} else {
			setBrand({
				...brand,
				id: value.id,
				name: value.name,
			});
		}
	};

	const handleInputChangeBrand = (event, value) => {
		const actualId = brand.id;
		const lastName = brand.name;

		if (!value) {
			setBrand({
				...brand,
				id: undefined,
				name: '',
			});
		} else if (
			lastName.length > value.length ||
			(lastName.length < value.length && actualId)
		) {
			setBrand({
				...brand,
				id: undefined,
				name: value,
			});
		} else {
			setBrand({
				...brand,
				name: value,
			});
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setRequest({ ...request, [name]: value });
	};

	const [createRequest] = useMutation(CREATE_REQUEST);

	// const handlePhoneChange = (e) => {
	// 	const phoneNumber = e.target.value;
	//
	// 	if (phoneNumber === '') {
	// 		setRequest({ ...request, phoneNumber });
	// 	} else {
	// 		if (/^\d+$/.test(phoneNumber)) setRequest({ ...request, phoneNumber });
	// 	}
	// };

	const cleanStates = () => {
		setRequest(InitialRequest);
		setClient(InitialClient);
		setBrand(InitialBrand);
		setCompany(InitialCompany);
		setSeller(InitialSeller);
		setSearchedCompanies([]);
		setSearchedClients([]);
		setSearchedBrands([]);
		setSearchedSellers([]);
	};

	useEffect(() => {
		console.log('STATE: )', seller);
	}, [seller]);

	const check = () => {
		if (!request.serviceType) {
			toast.error('Elige el tipo de servicio');
			return true;
		}

		if (brand.id || brand.name) {
			if (!request.productStatus) {
				toast.error('Elige el estado de producto');
				return true;
			}
		}

		if (
			(!client.phoneNumber || !client.email) &&
			(!company.phoneNumber || !company.email)
		) {
			if (company.name || client.firstName) {
				toast.error('Agrega una forma de contacto');
				return true;
			}
		}

		if (!seller.id) {
			toast.error('Elige un vendedor');
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

		const auxObject = {
			brandId: brand.id ?? null,
			brand: brand.name
				? (({ id, ...rest }) => ({
						...rest,
				  }))(brand)
				: null,
			clientId: client.id ?? null,
			client: client.firstName
				? (({ id, name, ...rest }) => ({
						...rest,
				  }))(client)
				: null,
			companyId: company.id ?? null,
			company: company.name
				? (({ id, ...rest }) => ({ ...rest }))(company)
				: null,
			sellerId: seller.id, // tiene que tener de a fuerza
		};

		const { productStatus, ...restRequest } = request;

		productStatus === ''
			? (restRequest.productStatus = null)
			: (restRequest.productStatus = productStatus);

		createRequest({ variables: { request: restRequest, ...auxObject } })
			.then((res) => {
				if (!res.errors) {
					toast.success('Guardado');
					refetchRequests();
					toggleDialog();
				} else {
					console.log('Errores', res.errors);
					toast.error('Error al guardar');
				}
				cleanStates();
				setLoading(false);
			})
			.catch((err) => {
				console.log('Error', err);
				toast.error('Error al guardar');
				setLoading(false);
			});
	};

	useEffect(() => {
		if (isVisible) {
			setRequest(InitialRequest);
		}
	}, [isVisible]);

	return (
		<Fragment>
			<Button variant={'text'} sx={{ ml: 'auto' }} onClick={toggleDialog}>
				{useMediaQuery(theme.breakpoints.down('sm'))
					? 'Crear'
					: 'Crear solicitud'}
			</Button>

			<Dialog open={isVisible} onClose={toggleDialog} maxWidth={'md'}>
				<DialogTitle>Nueva solicitud</DialogTitle>
				<DialogContent>
					<Grid container columnSpacing={1} rowSpacing={1}>
						<Grid item xs={12}>
							<Typography fontWeight={400}>Datos</Typography>
						</Grid>
						<Grid item xs={8} md={4}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Fecha:
							</Typography>
							<CustomDate
								date={request.requestDate}
								onChange={handleDateChange}
							/>
						</Grid>
						<Grid item xs={4}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Hora:
							</Typography>
							<CustomTime
								onChange={handleTimeChange}
								value={format(request.requestDate, 'HH:mm', { locale: es })}
							/>
						</Grid>
						<Grid item xs={6} md={4}>
							<Typography variant={'caption'}>Tipo de Servicio:</Typography>
							<FormControl margin={'none'}>
								<Select
									id={'serviceType'}
									name={'serviceType'}
									value={request.serviceType}
									onChange={handleInputChange}
								>
									{Object.entries(ServiceType).map((item) => (
										<MenuItem key={item[0]} value={item[0]}>
											{item[1]}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={6} md={4}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Estatus:
							</Typography>

							<FormControl margin={'none'}>
								<Select
									id={'requestStatus'}
									name={'requestStatus'}
									value={request.requestStatus}
									onChange={handleInputChange}
								>
									<MenuItem value={'PENDING'}>Pendiente</MenuItem>
									<MenuItem value={'FINISHED'}>Cotizado</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={6} md={4}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Medio de Contacto:
							</Typography>
							<TextField
								margin={'none'}
								fullWidth
								id={'contactMedium'}
								name={'contactMedium'}
								value={request.contactMedium}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={6} md={4}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Medio de Publicidad:
							</Typography>
							<TextField
								margin={'none'}
								fullWidth
								id={'advertisingMedium'}
								name={'advertisingMedium'}
								value={request.advertisingMedium}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<Divider sx={{ my: 2 }} />
						</Grid>
						<Grid item xs={12}>
							<Typography fontWeight={400}>Producto</Typography>
						</Grid>
						<Grid item xs={7}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Marca:
							</Typography>
							<Autocomplete
								freeSolo
								forcePopupIcon={true}
								options={searchedBrands}
								getOptionLabel={(option) =>
									typeof option === 'string' ? option : option.name
								}
								autoComplete
								includeInputInList
								value={brand.name}
								renderInput={(params) => (
									<TextField {...params} margin={'none'} />
								)}
								loading={loadingBrands}
								onInputChange={handleInputChangeBrand}
								onChange={handleInputOnChangeBrand}
								renderOption={(props, option) => (
									<li {...props} key={option.id}>
										<Grid container alignItems='center'>
											<Grid item>
												<Box sx={{ color: 'text.secondary', mr: 2 }} />
											</Grid>
											<Grid item xs>
												<Typography variant='body2' color='text.secondary'>
													{option.name}
												</Typography>
											</Grid>
										</Grid>
									</li>
								)}
							/>
						</Grid>
						<Grid item xs={5}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Estado:
							</Typography>

							<FormControl margin={'none'}>
								<Select
									id={'productStatus'}
									name={'productStatus'}
									value={request.productStatus}
									onChange={handleInputChange}
								>
									<MenuItem value={'NEW'}>Nuevo</MenuItem>
									<MenuItem value={'USED'}>Usado</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Comentarios:
							</Typography>
							<TextField
								fullWidth
								multiline
								maxRows={4}
								margin={'none'}
								id={'comments'}
								name={'comments'}
								value={request.comments}
								onChange={handleInputChange}
							/>
						</Grid>

						<Grid item xs={12}>
							<Divider sx={{ my: 2 }} />
						</Grid>
						<Grid item xs={12}>
							<Typography fontWeight={400}>Contacto</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Compañía:
							</Typography>
							<Autocomplete
								freeSolo
								forcePopupIcon={true}
								options={searchedCompanies}
								getOptionLabel={(option) =>
									typeof option === 'string' ? option : option.name
								}
								autoComplete
								includeInputInList
								value={company.name}
								renderInput={(params) => (
									<TextField {...params} margin={'none'} />
								)}
								loading={loadingCompanies}
								onInputChange={handleInputChangeCompany}
								onChange={handleInputOnChangeCompany}
								renderOption={(props, option) => (
									<li {...props} key={option.id}>
										<Grid container alignItems='center'>
											<Grid item>
												<Box
													component={HomeWork}
													sx={{ color: 'text.secondary', mr: 2 }}
												/>
											</Grid>
											<Grid item xs>
												<Typography variant='body2' color='text.secondary'>
													{option.name}
												</Typography>
											</Grid>
										</Grid>
									</li>
								)}
							/>
						</Grid>
						<Grid item xs={3}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Teléfono empresa:
							</Typography>
							<TextField
								margin={'none'}
								fullWidth
								id={'phoneNumber'}
								name={'phoneNumber'}
								value={company.phoneNumber}
								onChange={handlePhoneChangeCompany}
								inputProps={{ maxLength: 10, inputMode: 'numeric' }}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>+52</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={3}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Correo empresa:
							</Typography>
							<TextField
								margin={'none'}
								fullWidth
								id={'email'}
								name={'email'}
								value={company.email}
								onChange={handleEmailChangeCompany}
							/>
						</Grid>
						<Grid item xs={6}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Cliente:
							</Typography>
							<Autocomplete
								freeSolo
								forcePopupIcon={true}
								options={searchedClients}
								getOptionLabel={(option) =>
									typeof option === 'string'
										? option
										: `${option.firstName + ' ' + option.lastName}`
								}
								autoComplete
								includeInputInList
								value={client.firstName}
								renderInput={(params) => (
									<TextField {...params} margin={'none'} />
								)}
								loading={loading}
								onInputChange={handleInputChangeClient}
								onChange={handleInputOnChangeClient}
								renderOption={(props, option) => (
									<li {...props} key={option.id}>
										<Grid container alignItems='center'>
											<Grid item>
												<Box
													component={Person}
													sx={{ color: 'text.secondary', mr: 2 }}
												/>
											</Grid>
											<Grid item xs>
												<Typography variant='body2' color='text.secondary'>
													{option.firstName + ' ' + option.lastName}
												</Typography>
											</Grid>
										</Grid>
									</li>
								)}
							/>
						</Grid>
						<Grid item xs={3}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Teléfono cliente:
							</Typography>
							<TextField
								margin={'none'}
								fullWidth
								id={'phoneNumber'}
								name={'phoneNumber'}
								value={client.phoneNumber}
								onChange={handlePhoneChangeClient}
								inputProps={{ maxLength: 10, inputMode: 'numeric' }}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>+52</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={3}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Correo cliente:
							</Typography>
							<TextField
								margin={'none'}
								fullWidth
								id={'email'}
								name={'email'}
								value={client.email}
								onChange={handleEmailChangeClient}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography fontWeight={400} fontSize={14} align={'right'} mt={1}>
								En caso de no contar con cliente o compañía, guarda la forma de
								contacto en <b>comentarios</b>.
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Divider sx={{ my: 2 }} />
						</Grid>
						<Grid item xs={12}>
							<Typography fontWeight={400}>Atención</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Asesor:
							</Typography>
							<Autocomplete
								freeSolo
								forcePopupIcon={true}
								options={searchedSellers}
								getOptionLabel={(option) =>
									typeof option === 'string'
										? option
										: `${option.firstName + ' ' + option.lastName}`
								}
								autoComplete
								includeInputInList
								value={seller.name}
								renderInput={(params) => (
									<TextField {...params} margin={'none'} />
								)}
								loading={loadingSellers}
								onInputChange={handleInputChangeSeller}
								onChange={handleInputOnChangeSeller}
								renderOption={(props, option) => (
									<li {...props} key={option.id}>
										<Grid container alignItems='center'>
											<Grid item>
												<Box
													component={Person}
													sx={{ color: 'text.secondary', mr: 2 }}
												/>
											</Grid>
											<Grid item xs>
												<Typography variant='body2' color='text.secondary'>
													{option?.firstName + ' ' + option?.lastName}
												</Typography>
											</Grid>
										</Grid>
									</li>
								)}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Observaciones:
							</Typography>
							<TextField
								fullWidth
								multiline
								margin={'none'}
								maxRows={4}
								id={'extraComments'}
								name={'extraComments'}
								value={request.extraComments}
								onChange={handleInputChange}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant={'text'} onClick={cleanStates} sx={{ mr: 'auto' }}>
						Limpiar
					</Button>
					<Button onClick={toggleDialog} variant={'outlined'}>
						Salir
					</Button>
					<Button onClick={onFinish}>Guardar</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

NewRequestDialog.propTypes = {
	refetchRequests: PropTypes.func.isRequired,
};

export default NewRequestDialog;
