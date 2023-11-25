import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import {
	Autocomplete,
	Box,
	Button,
	Divider,
	Drawer,
	FormControl,
	Grid,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import { ServiceType } from '@utils/enums';
import { Edit, Person } from '@mui/icons-material';
import { useLoading } from '@providers/loading';
import { useLazyQuery, useMutation } from '@apollo/client';
import useDebounce from '@hooks/use-debounce';
import toast from 'react-hot-toast';
import { DateTimeField } from '@mui/x-date-pickers';
import {
	ROLES,
	SCOPES_GENERAL,
	SCOPES_REQUEST,
	SCOPES_REQUEST_DETAILS,
} from '@config/permisissions/permissions';
import PermissionsGate from '@components/PermissionsGate';
import { useSession } from '@providers/session';
import {
	GET_BRANDS,
	GET_CLIENTS,
	GET_COMPANIES,
	GET_SELLERS,
} from '@views/main/requests/queryRequests';
import { UPDATE_REQUEST } from '@views/main/requests/mutationRequests';
import { pxToRem } from '@config/theme/functions';

const EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const InitialRequest = {
	id: '',
	requestDate: new Date(),
	serviceType: '',
	contactMedium: '',
	advertisingMedium: '',
	productStatus: '',
	comments: '',
	extraComments: '',
	requestStatus: '',
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

const RequestEdit = ({ requestData, requestRefetch }) => {
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

	const handleNameChangeClient = (e) => {
		const lastName = e.target.value;
		const existId = client.id;
		existId
			? // deletes id cuz is new client
			  setClient({ ...client, id: undefined, lastName })
			: setClient({ ...client, lastName });
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

	const [updateRequest] = useMutation(UPDATE_REQUEST);

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
				if (!company.phoneNumber && !company.email) {
					toast.error('Agrega una forma de contacto');
					return true;
				}

				if (company.phoneNumber)
					if (company.phoneNumber.length < 10) {
						toast.error('Número incompleto');
						return true;
					}

				if (company.email)
					if (!EMAIL.test(company.email)) {
						toast.error('Revisa el email');
						return true;
					}
			}
		}

		if (!seller.id && role !== ROLES.salesOperator) {
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

		const reqAux = (({ id, ...rest }) => ({ ...rest }))(request);

		const auxObject = {
			sellerId: seller.id ?? undefined, // tiene que tener de a fuerza
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
			// requestId: request.id,
			...reqAux,
		};

		// console.log('LOL', auxObject);

		updateRequest({ variables: { requestId: request.id, request: auxObject } })
			.then((res) => {
				if (!res.errors) {
					toast.success('Guardado');
					requestRefetch();
					toggleDialog();
				} else {
					console.log('Errores', res.errors);
					toast.error('Error al guardar');
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log('Error', err);
				toast.error('Error al guardar');
				setLoading(false);
			});
	};

	useEffect(() => {
		if (requestData) {
			// console.log('data12', requestData);

			const {
				createdAt,
				createdBy,
				updatedAt,
				updatedBy,
				requestDate,
				brand,
				client,
				company,
				assignedUser,
				shortId,
				documents,
				...auxReq
			} = requestData;

			// console.log('data', requestData);

			const auxBrand = {
				id: requestData.brand?.id ?? undefined,
				name: requestData.brand?.name ?? '',
			};

			const auxCompany = {
				id: requestData.company?.id ?? undefined,
				name: requestData.company?.name ?? '',
				phoneNumber: requestData.company?.phoneNumber ?? '',
				email: requestData.company?.email ?? '',
			};

			const auxClient = {
				id: requestData.client?.id ?? undefined,
				firstName: requestData.client?.firstName ?? '',
				lastName: requestData.client?.lastName ?? '',
				phoneNumber: requestData.client?.phoneNumber ?? '',
				email: requestData.client?.email ?? '',
				get name() {
					return (this.firstName + ' ' + this.lastName).trim();
				},
			};

			const auxSeller = {
				id: requestData.assignedUser?.id ?? undefined,
				firstName: requestData.assignedUser?.firstName ?? '',
				lastName: requestData.assignedUser?.lastName ?? '',
				get name() {
					return (this.firstName + ' ' + this.lastName).trim();
				},
			};

			// console.log('first sell', auxSeller);

			setRequest({ requestDate: new Date(requestDate), ...auxReq });
			setBrand(auxBrand);
			setCompany(auxCompany);
			setClient(auxClient);
			setSeller(auxSeller);
		}
	}, [requestData, isVisible]);

	return (
		<Fragment>
			<Button variant={'contained'} onClick={toggleDialog} startIcon={<Edit />}>
				Editar
			</Button>

			<Drawer
				anchor={'right'}
				open={isVisible}
				// open={true}
				onClose={toggleDialog}
				sx={{
					'& .MuiDrawer-paper': {
						width: 600,
						height: `calc(100vh - 128px)`,
						// height: `calc(100vh - 32px)`,
						top: pxToRem(64),
						borderRadius: pxToRem(16),
						marginRight: pxToRem(22),
						border: 'none',
						whiteSpace: 'nowrap',
						boxSizing: 'border-box',
						backdropFilter: `saturate(200%) blur(1.875rem)`,
						boxShadow: `0px 1px 2px rgba(3, 7, 18, 0.05),
												1px 3px 9px rgba(3, 7, 18, 0.10),
												3px 8px 20px rgba(3, 7, 18, 0.15),
												4px 13px 36px rgba(3, 7, 18, 0.20),
												7px 21px 56px rgba(3, 7, 18, 0.25),
												10px 30px 80px rgba(3, 7, 18, 0.30);`,
					},
				}}
				slotProps={{
					backdrop: {
						sx: {
							bgcolor: `${theme.palette.background.default}90`,
							backdropFilter: `blur(${pxToRem(8)})`,
						},
					},
				}}
			>
				<Box
					sx={{
						height: '100%',
						p: pxToRem(16),
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Typography variant={'primaryNormal16'} mb={pxToRem(16)}>
						Nueva solicitud
					</Typography>

					<Grid container columnSpacing={1} rowSpacing={1}>
						<Grid container rowSpacing={1} item sm={5}>
							<Grid item xs={12}>
								<DateTimeField
									sx={{ m: 0 }}
									label={'Fecha'}
									value={request.requestDate}
									format={'dd MMM yy - HH:mm'}
									onChange={(newValue) =>
										setRequest({ ...request, requestDate: newValue })
									}
								/>
							</Grid>

							{/* <Grid item xs={12}> */}
							{/* 	<FormControl margin={'none'}> */}
							{/* 		<InputLabel>Estatus</InputLabel> */}
							{/* 		<Select */}
							{/* 			id={'requestStatus'} */}
							{/* 			name={'requestStatus'} */}
							{/* 			value={request.requestStatus} */}
							{/* 			onChange={handleInputChange} */}
							{/* 		> */}
							{/* 			<MenuItem value={'PENDING'}>Pendiente</MenuItem> */}
							{/* 			<MenuItem value={'TRACING'}>En curso</MenuItem> */}
							{/* 			<MenuItem value={'FINISHED'}>Cotizado</MenuItem> */}
							{/* 		</Select> */}
							{/* 	</FormControl> */}
							{/* </Grid> */}
							<Grid item xs={12}>
								<FormControl margin={'none'}>
									<InputLabel>Tipo de Servicio</InputLabel>
									<Select
										id={'serviceType'}
										name={'serviceType'}
										label={'Tipo de Servicio'}
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
							<Grid item xs={12}>
								<TextField
									margin={'none'}
									fullWidth
									id={'contactMedium'}
									name={'contactMedium'}
									label={'Medio de Contacto'}
									value={request.contactMedium}
									onChange={handleInputChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									margin={'none'}
									fullWidth
									id={'advertisingMedium'}
									name={'advertisingMedium'}
									label={'Medio de Publicidad'}
									value={request.advertisingMedium}
									onChange={handleInputChange}
								/>
							</Grid>
						</Grid>

						<Grid item sm={2} display={'flex'} justifyContent={'center'}>
							<Divider orientation={'vertical'} />
						</Grid>

						<Grid container rowSpacing={1} item sm={5}>
							<PermissionsGate
								scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.total]}
							>
								<Grid item xs={12}>
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
											<TextField {...params} margin={'none'} label={'Asesor'} />
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
							</PermissionsGate>
							<Grid item xs={12}>
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
									renderInput={(params) => (
										<TextField {...params} margin={'none'} label={'Marca'} />
									)}
									loading={loadingBrands}
									onInputChange={handleInputChangeBrand}
									onChange={handleInputOnChangeBrand}
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControl margin={'none'}>
									<InputLabel>Estado</InputLabel>
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
								<TextField
									fullWidth
									multiline
									maxRows={4}
									margin={'none'}
									id={'comments'}
									name={'comments'}
									label={'Comentarios'}
									value={request.comments}
									onChange={handleInputChange}
								/>
							</Grid>
						</Grid>

						<Grid item xs={12}>
							<Divider sx={{ my: 2 }} />
						</Grid>

						<Grid item xs={12}>
							<Typography fontWeight={400}>Contacto</Typography>
						</Grid>
						<Grid item xs={6}>
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
								renderInput={(params) => (
									<TextField {...params} margin={'none'} label={'Compañía'} />
								)}
								loading={loadingCompanies}
								onInputChange={handleInputChangeCompany}
								onChange={handleInputOnChangeCompany}
							/>
						</Grid>
						<Grid item xs={3}>
							<TextField
								margin={'none'}
								fullWidth
								id={'phoneNumber'}
								name={'phoneNumber'}
								label={'Teléfono empresa'}
								value={company.phoneNumber}
								onChange={handlePhoneChangeCompany}
								disabled={company.id || !company.name}
								inputProps={{ maxLength: 10, inputMode: 'numeric' }}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>+52</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={3}>
							<TextField
								margin={'none'}
								fullWidth
								id={'email'}
								name={'email'}
								label={'Correo empresa'}
								value={company.email}
								onChange={handleEmailChangeCompany}
								disabled={company.id || !company.name}
							/>
						</Grid>
						<Grid item xs={6} md={3}>
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
								renderInput={(params) => (
									<TextField
										{...params}
										margin={'none'}
										label={'Nombre cliente'}
									/>
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
						<Grid item xs={6} md={3}>
							<TextField
								fullWidth
								margin={'none'}
								id={'lastName'}
								name={'lastName'}
								label={'Apellido cliente'}
								value={client.lastName}
								onChange={handleNameChangeClient}
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<TextField
								margin={'none'}
								fullWidth
								id={'phoneNumber'}
								name={'phoneNumber'}
								label={'Teléfono cliente'}
								value={client.phoneNumber}
								onChange={handlePhoneChangeClient}
								disabled={client.id || !(client.firstName && client.lastName)}
								inputProps={{ maxLength: 10, inputMode: 'numeric' }}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>+52</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<TextField
								margin={'none'}
								fullWidth
								id={'email'}
								name={'email'}
								label={'Correo cliente'}
								value={client.email}
								onChange={handleEmailChangeClient}
								disabled={client.id || !(client.firstName && client.lastName)}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography variant={'primaryLight12'}>
								En caso de no contar con cliente o compañía, guarda la forma de
								contacto en <b>comentarios</b>.
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Divider sx={{ my: 2 }} />
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								margin={'none'}
								maxRows={4}
								id={'extraComments'}
								name={'extraComments'}
								label={'Observaciones'}
								value={request.extraComments}
								onChange={handleInputChange}
							/>
						</Grid>
					</Grid>

					<Stack mt={'auto'} flexDirection={'row'} justifyContent={'flex-end'}>
						<Button
							onClick={toggleDialog}
							variant={'outlined'}
							sx={{ mr: pxToRem(8) }}
						>
							Salir
						</Button>
						<Button onClick={onFinish}>Guardar</Button>
					</Stack>
				</Box>
			</Drawer>
		</Fragment>
	);
};

RequestEdit.propTypes = {
	requestData: PropTypes.object,
	requestsRefetch: PropTypes.func.isRequired,
};

export default RequestEdit;
