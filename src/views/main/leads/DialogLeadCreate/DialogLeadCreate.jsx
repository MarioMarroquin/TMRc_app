import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import {
	Autocomplete,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
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
import { ContactMedium, ServiceType } from '@utils/enums';
import { Add, Person } from '@mui/icons-material';
import { useLazyQuery, useMutation } from '@apollo/client';
import useDebounce from '@hooks/use-debounce';
import { useLoading } from '@providers/loading';
import toast from 'react-hot-toast';
import { DateTimeField } from '@mui/x-date-pickers';
import { ROLES } from '@config/permisissions/permissions';
import { useSession } from '@providers/session';
import {
	GET_BRANDS,
	GET_CLIENTS,
	GET_COMPANIES,
	GET_SELLERS,
} from '@views/main/requests/queryRequests';
import { CREATE_REQUEST } from '@views/main/requests/mutationRequests';
import titleCaseClean from '@utils/formatters/titleCaseClean';
import { isBefore } from 'date-fns';

const EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

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

const DialogLeadCreate = ({ refetchRequests }) => {
	const theme = useTheme();
	const { role } = useSession();
	const { setLoading } = useLoading();
	const [request, setRequest] = useState(InitialRequest);
	const [isVisible, setIsVisible] = useState(false);
	const toggleDialog = () => setIsVisible((prev) => !prev);

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

		const auxValue = titleCaseClean(value);

		if (!value) {
			setClient({
				...client,
				id: undefined,
				firstName: '',
				lastName: '',
			});
		} else if (
			lastName.length > auxValue.length ||
			(lastName.length < auxValue.length && actualId)
		) {
			setClient({
				...client,
				id: undefined,
				firstName: auxValue,
			});
		} else {
			setClient({
				...client,
				firstName: auxValue,
			});
		}
	};

	const handlePhoneChangeClient = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setClient({ ...client, phoneNumber });
		} else {
			const aux = phoneNumber.split(' ').join('');
			if (/^\d+$/.test(aux) && aux.length <= 10)
				setClient({ ...client, phoneNumber: aux });
		}
	};

	const handleEmailChangeClient = (e) => {
		const email = e.target.value;

		setClient({ ...client, email });
	};

	const handleNameChangeClient = (e) => {
		const lastName = e.target.value;
		const existId = client.id;
		const aux = titleCaseClean(lastName);

		existId
			? // deletes id cuz is new client
			  setClient({ ...client, id: undefined, lastName: aux })
			: setClient({ ...client, lastName: aux });
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
	};

	const handleInputChangeSeller = (event, value) => {
		const actualId = client.id;
		const lastName = seller.name;

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

		// console.log('value', value);
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
			const aux = phoneNumber.split(' ').join('');
			if (/^\d+$/.test(aux) && aux.length <= 10)
				setCompany({ ...company, phoneNumber: aux });
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

	const check = () => {
		if (!request.serviceType) {
			toast.error('Elige el tipo de servicio');
			return true;
		}

		if (!brand.name) {
			toast.error('Elige la marca');
			return true;
		}

		if (brand.id || brand.name) {
			if (!request.productStatus) {
				toast.error('Elige el estado de producto');
				return true;
			}
		}

		if (!client.id) {
			if (
				(client.firstName && !client.lastName) ||
				(!client.firstName && client.lastName)
			) {
				toast.error('Completa el nombre del cliente.');
				return true;
			}

			if (client.firstName && client.lastName) {
				if (!client.phoneNumber && !client.email) {
					toast.error('Agrega una forma de contacto');
					return true;
				}

				if (client.phoneNumber)
					if (client.phoneNumber.length < 10) {
						toast.error('Número incompleto');
						return true;
					}

				if (client.email)
					if (!EMAIL.test(client.email)) {
						toast.error('Revisa el email');
						return true;
					}
			}
		}

		if (!company.id) {
			if (company.name) {
				// if (!company.phoneNumber && !company.email) {
				// 	toast.error('Agrega una forma de contacto');
				// 	return true;
				// }

				if (company.phoneNumber)
					if (company.phoneNumber.length < 10) {
						toast.error('Número incompleto');
						return true;
					}

				// if (company.email)
				// 	if (!EMAIL.test(company.email)) {
				// 		toast.error('Revisa el email');
				// 		return true;
				// 	}
			}
		}

		if (!seller.id && role !== ROLES.salesOperator) {
			toast.error('Elige un vendedor');
			return true;
		}

		if (
			role === ROLES.salesOperator &&
			isBefore(request.requestDate, new Date())
		) {
			toast.error('La fecha no puede ser anterior al día de hoy');
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

		const finalRequest = {
			...request,
			sellerId: seller.id, // tiene que tener de a fuerza
			brandId: brand.id ?? null,
			brand: brand.name
				? (({ id, ...rest }) => ({
						...rest,
				  }))(brand)
				: null,
			clientId: client.id ?? null,
			client:
				client.firstName && client.lastName
					? (({ id, name, ...rest }) => ({
							...rest,
					  }))(client)
					: null,
			companyId: company.id ?? null,
			company: company.name
				? (({ id, ...rest }) => ({ ...rest }))(company)
				: null,
		};

		// console.log('comp', company);
		// console.log('akliii', finalRequest);

		if (!finalRequest.clientId && finalRequest.client) {
			if (!finalRequest.client.email.length) finalRequest.client.email = null;

			if (!finalRequest.client.phoneNumber.length)
				finalRequest.client.phoneNumber = null;
		}

		if (!finalRequest.companyId && finalRequest.company) {
			if (!finalRequest.company.email.length) finalRequest.company.email = null;

			if (!finalRequest.company.phoneNumber.length)
				finalRequest.company.phoneNumber = null;
		}

		createRequest({ variables: { request: finalRequest } })
			.then((res) => {
				if (!res.errors) {
					toast.success('Solicitud creada');
					refetchRequests();
					toggleDialog();
				} else {
					console.log('Errores', res.errors);
					toast.error('Error al crear');
				}
				cleanStates();
				setLoading(false);
			})
			.catch((err) => {
				console.log('Error', err);
				toast.error('Ocurrio un error');
				setLoading(false);
			});
	};

	useEffect(() => {
		InitialRequest.requestDate = new Date();

		if (isVisible) {
			const aux = { ...InitialRequest };
			setRequest(aux);
		}
	}, [isVisible]);

	const isAv = () => {
		return Boolean(client.firstName);
	};

	return (
		<Fragment>
			<Button
				onClick={toggleDialog}
				startIcon={<Add />}
				sx={{ ml: 16, minWidth: 150 }}
			>
				{useMediaQuery(theme.breakpoints.down('sm'))
					? 'Crear'
					: 'Crear solicitud'}
			</Button>

			<Dialog open={isVisible} fullWidth maxWidth={'md'}>
				<DialogTitle>Crear nueva solicitud</DialogTitle>
				<DialogContent>
					<DialogContentText></DialogContentText>

					<Grid container>
						<Grid item container xs={12} sm={6}>
							<Grid item xs={12} sm={7} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Asesor
								</Typography>
								<Autocomplete
									disabled={role === ROLES.salesOperator}
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
									renderInput={(params) => <TextField {...params} />}
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

							<Grid item xs={12} sm={5} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Fecha
								</Typography>
								<DateTimeField
									sx={{ m: 0 }}
									value={request.requestDate}
									format={'dd MMM yy - HH:mm'}
									onChange={(newValue) =>
										setRequest({ ...request, requestDate: newValue })
									}
								/>
							</Grid>

							<Grid item xs={12} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Marca
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
									ListboxProps={{ style: { padding: 0 } }}
									value={brand.name}
									renderInput={(params) => <TextField {...params} />}
									loading={loadingBrands}
									onInputChange={handleInputChangeBrand}
									onChange={handleInputOnChangeBrand}
								/>
							</Grid>

							<Grid item xs={12} sm={6} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Tipo de Servicio
								</Typography>
								<FormControl>
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

							<Grid item xs={12} sm={6} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Estado de Maquinaria
								</Typography>
								<FormControl>
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

							<Grid item xs={12} sm={6} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Medio de Contacto
								</Typography>
								<FormControl>
									<Select
										id={'contactMedium'}
										name={'contactMedium'}
										value={request.contactMedium}
										onChange={handleInputChange}
									>
										{ContactMedium.map((item) => (
											<MenuItem key={item} value={item}>
												{item}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							<Grid item xs={12} sm={6} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Medio de Publicidad
								</Typography>
								<TextField
									id={'advertisingMedium'}
									name={'advertisingMedium'}
									value={request.advertisingMedium}
									onChange={handleInputChange}
								/>
							</Grid>

							<Grid item xs={12} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Comentarios
								</Typography>
								<TextField
									multiline
									maxRows={4}
									id={'comments'}
									name={'comments'}
									value={request.comments}
									onChange={handleInputChange}
								/>
							</Grid>
						</Grid>

						<Grid item container xs={12} sm={6}>
							<Grid item xs={12} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Compañías
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
									ListboxProps={{ style: { padding: 0 } }}
									value={company.name}
									renderInput={(params) => <TextField {...params} />}
									loading={loadingCompanies}
									onInputChange={handleInputChangeCompany}
									onChange={handleInputOnChangeCompany}
								/>
							</Grid>

							<Grid item xs={12} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Correo Empresa
								</Typography>
								<TextField
									id={'email'}
									name={'email'}
									value={company.email}
									onChange={handleEmailChangeCompany}
									disabled={company.id || !company.name}
								/>
							</Grid>

							<Grid item xs={12} sm={6} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Nombre de Cliente
								</Typography>
								<Autocomplete
									freeSolo
									forcePopupIcon={true}
									options={searchedClients}
									getOptionLabel={(option) =>
										typeof option === 'string' ? option : option.firstName
									}
									autoComplete
									includeInputInList
									value={client.firstName}
									renderInput={(params) => <TextField {...params} />}
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
							<Grid item xs={12} sm={6} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Apellido de Cliente
								</Typography>
								<TextField
									id={'lastName'}
									name={'lastName'}
									value={client.lastName}
									onChange={handleNameChangeClient}
								/>
							</Grid>
							<Grid item xs={12} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Correo Cliente
								</Typography>
								<TextField
									sx={{ borderColor: 'green' }}
									id={'email'}
									name={'email'}
									value={client.email}
									onChange={handleEmailChangeClient}
									disabled={client.id || !(client.firstName && client.lastName)}
								/>
							</Grid>
							<Grid item xs={12} sm={6} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Número (cliente)
								</Typography>
								<TextField
									id={'phoneNumber'}
									name={'phoneNumber'}
									value={client.phoneNumber}
									onChange={handlePhoneChangeClient}
									disabled={client.id || !(client.firstName && client.lastName)}
									inputProps={{ inputMode: 'numeric' }}
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>+52</InputAdornment>
										),
									}}
								/>
							</Grid>

							<Grid item xs={12} sm={6} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Número (empresa)
								</Typography>
								<TextField
									id={'phoneNumber'}
									name={'phoneNumber'}
									value={company.phoneNumber}
									onChange={handlePhoneChangeCompany}
									disabled={company.id || !company.name}
									inputProps={{ inputMode: 'numeric' }}
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>+52</InputAdornment>
										),
									}}
								/>
							</Grid>
						</Grid>
						<Grid item xs={12} sx={{ p: 4 }}>
							<Typography fontSize={12} fontWeight={500} ml={'4px'}>
								Observaciones
							</Typography>
							<TextField
								multiline
								maxRows={3}
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
					<Button variant={'outlined'} onClick={toggleDialog}>
						Cerrar
					</Button>
					<Button onClick={onFinish}>Guardar</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

DialogLeadCreate.propTypes = {
	refetchRequests: PropTypes.func.isRequired,
};

export default DialogLeadCreate;
