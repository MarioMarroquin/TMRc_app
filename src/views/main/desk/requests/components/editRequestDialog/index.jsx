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
	FormControl,
	Grid,
	IconButton,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { ServiceType } from '@utils/enums';
import { Edit, LocationOn } from '@mui/icons-material';
import { useLoading } from '@providers/loading';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
	GET_BRANDS,
	GET_CLIENTS,
	GET_COMPANIES,
} from '../newRequestDialog/requests';
import useDebounce from '@hooks/use-debounce';
import { UPDATE_REQUEST } from './requests';
import toast from 'react-hot-toast';
import CustomDate from '@components/customDate';
import CustomTime from '@components/customTime';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
};

const InitialClient = {
	id: undefined,
	firstName: '',
	lastName: '',
	get name() {
		return (this.firstName + ' ' + this.lastName).trim();
	},
};

const EditRequestDialog = ({ data }) => {
	const { setLoading } = useLoading();
	const [request, setRequest] = useState(InitialRequest);
	const [isVisible, setIsVisible] = useState(false);
	const toggleDialog = () => setIsVisible((prev) => !prev);

	const handleDateChange = (requestDate) => {
		setRequest({ ...request, requestDate });
	};

	const handleTimeChange = (requestDate) => {
		setRequest({ ...request, requestDate });
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setRequest({ ...request, [name]: value });
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
			});
		} else {
			setClient({
				...client,
				id: value.id,
				firstName: value.firstName,
				lastName: value.lastName,
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
			});
		} else {
			setCompany({
				...company,
				id: value.id,
				name: value.name,
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

	const [updateRequest] = useMutation(UPDATE_REQUEST);

	const onFinish = (e) => {
		e.preventDefault();

		setLoading(true);

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
			requestId: request.id,
			request: (({ id, ...rest }) => ({ ...rest }))(request),
		};

		updateRequest({ variables: auxObject })
			.then((res) => {
				if (!res.errors) {
					toast.success('Guardado');
					toggleDialog();
				} else {
					console.log('Errores', res.errors);
					toast.error('Error al guardar');
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log('Error', err);
				setLoading(false);
			});
	};

	useEffect(() => {
		if (data) {
			const {
				createdAt,
				createdBy,
				updatedAt,
				updatedBy,
				requestDate,
				brand,
				client,
				company,
				user,
				...auxReq
			} = data;

			const auxBrand = {
				id: data.brand?.id ?? undefined,
				name: data.brand?.name ?? '',
			};

			const auxCompany = {
				id: data.company?.id ?? undefined,
				name: data.company?.name ?? '',
			};

			const auxClient = {
				id: data.client?.id ?? undefined,
				firstName: data.client?.firstName ?? '',
				lastName: data.client?.lastName ?? '',
				get name() {
					return (this.firstName + ' ' + this.lastName).trim();
				},
			};

			setRequest({ requestDate: new Date(requestDate), ...auxReq });
			setBrand(auxBrand);
			setCompany(auxCompany);
			setClient(auxClient);
		}
	}, [data, isVisible]);

	return (
		<Fragment>
			{/*  <Button sx={{ ml: 'auto' }} disableRipple onClick={toggleDialog}> */}
			{/* 	Solicitud */}
			{/* </Button> */}

			<IconButton onClick={toggleDialog}>
				<Edit />
			</IconButton>

			<Dialog open={isVisible} onClose={toggleDialog}>
				<DialogTitle>Nueva solicitud</DialogTitle>
				<DialogContent>
					<Grid container columnSpacing={1} rowSpacing={1}>
						<Grid item xs={8}>
							<Typography variant={'caption'}>Fecha:</Typography>
							<CustomDate
								date={request.requestDate}
								onChange={handleDateChange}
							/>
						</Grid>
						<Grid item xs={4}>
							<Typography variant={'caption'}>Hora:</Typography>
							<CustomTime
								onChange={handleTimeChange}
								value={format(request.requestDate, 'HH:mm', { locale: es })}
							/>
						</Grid>
						<Grid item xs={6}>
							<Typography variant={'caption'}>Tipo de Servicio:</Typography>
							<FormControl margin={'none'}>
								<Select
									id={'service'}
									name={'service'}
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
						<Grid item xs={6}>
							<Typography variant={'caption'}>Estatus:</Typography>

							<FormControl margin={'none'}>
								<Select
									id={'status'}
									name={'status'}
									value={request.requestStatus}
									onChange={handleInputChange}
								>
									<MenuItem value={'PENDING'}>Pendiente</MenuItem>
									<MenuItem value={'FINISHED'}>Concluida</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<Typography variant={'caption'}>Medio de Contacto:</Typography>
							<TextField
								margin={'none'}
								fullWidth
								id={'contactMedium'}
								name={'contactMedium'}
								value={request.contactMedium}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={6}>
							<Typography variant={'caption'}>Medio de Publicidad:</Typography>
							<TextField
								margin={'none'}
								fullWidth
								id={'advertisingMedium'}
								name={'advertisingMedium'}
								value={request.advertisingMedium}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={7}>
							<Typography variant={'caption'}>Marca:</Typography>
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
												<Box
													component={LocationOn}
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
						<Grid item xs={5}>
							<Typography variant={'caption'}>Estado:</Typography>

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
							<Typography variant={'caption'}>Comentarios:</Typography>
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
						<Grid item xs={6}>
							<Typography variant={'caption'}>Compañía:</Typography>
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
													component={LocationOn}
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
						<Grid item xs={6}>
							<Typography variant={'caption'}>Cliente:</Typography>
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
								value={client.name}
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
													component={LocationOn}
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
						<Grid item xs={12}>
							<Typography variant={'caption'}>Observaciones:</Typography>
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
					<Button onClick={toggleDialog} variant={'outlined'}>
						Salir
					</Button>
					<Button onClick={onFinish}>Guardar</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

EditRequestDialog.propTypes = {
	data: PropTypes.object,
};

export default EditRequestDialog;
