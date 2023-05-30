import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import {
	Autocomplete,
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { ServiceType } from '../../../../../utils/enums';
import { LocationOn } from '@mui/icons-material';
import { useLazyQuery } from '@apollo/client';
import { GET_CLIENTS } from './requests';
import useDebounce from '../../../../../hooks/use-debounce';

const InitialRequest = {
	requestDate: new Date(),
	service: '',
	contactMedium: '',
	advertisingMedium: '',
	productStatus: '',
	comments: '',
	extraComments: '',
	status: '',
	sale: null,
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
	firstLastName: '',
	get name() {
		return (this.firstName + ' ' + this.firstLastName).trim();
	},
};

const NewRequestDialog = ({ refetchRequests }) => {
	const [request, setRequest] = useState(InitialRequest);
	const [isVisible, setIsVisible] = useState(false);

	// para clientes
	const [searchedClients, setSearchedClients] = useState([]);
	const [client, setClient] = useState(InitialClient);

	const [searchClients, { data, loading }] = useLazyQuery(GET_CLIENTS);

	const debouncedClient = useDebounce(client.firstName, 700);

	// fetch data from server CLIENTS
	useEffect(() => {
		searchClients({ variables: { text: client.firstName } });
	}, [debouncedClient]);

	useEffect(() => {
		if (data) {
			const aux = data.searchClients.results;
			console.log(aux);
			setSearchedClients(aux);
		}
	}, [data]);

	const handleInputOnChangeClient = (event, value) => {
		if (!value) {
			setClient({
				...client,
				id: undefined,
				firstName: '',
				firstLastName: '',
			});
		} else {
			setClient({
				...client,
				id: value.id,
				firstName: value.firstName,
				firstLastName: value.firstLastName,
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
				firstLastName: '',
			});
		} else if (
			lastName.length > value.length ||
			(lastName.length < value.length && actualId)
		) {
			setClient({
				...client,
				id: undefined,
				firstName: value,
				firstLastName: '',
			});
		} else {
			setClient({
				...client,
				firstName: value,
			});
		}
	};

	const toggleDialog = () => setIsVisible((prev) => !prev);

	const handleTimeChange = (requestDate) => {
		setRequest({ ...request, requestDate });
	};

	return (
		<Fragment>
			<Button sx={{ ml: 'auto' }} disableRipple onClick={toggleDialog}>
				Open
			</Button>

			<Dialog open={isVisible} onClose={toggleDialog}>
				<DialogTitle>Nueva solicitud</DialogTitle>
				<DialogContent>
					<Grid container columnSpacing={1}>
						<Grid item>
							<DateTimePicker
								label='Fecha'
								value={request.requestDate}
								formatDensity={'spacious'}
								sx={{
									'&.Mui-selected': {
										color: 'secondary',
									},
								}}
								onChange={null}
							/>
						</Grid>
						<Grid item>
							<FormControl>
								<InputLabel>Tipo de Servicio</InputLabel>
								<Select
									label={'Tipo de Servicio'}
									id={'serviceType'}
									name={'serviceType'}
									value={''}
									onChange={(e) => null}
								>
									{Object.entries(ServiceType).map((item) => (
										<MenuItem key={item[0]} value={item[0]}>
											{item[1]}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								id={'contactMedium'}
								name={'contactMedium'}
								label={'Medio de contacto'}
								value={null}
								onChange={null}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								id={'advertisingMedium'}
								name={'advertisingMedium'}
								label={'Medio de publicidad'}
								value={null}
								onChange={null}
							/>
						</Grid>
						<Grid item>
							<FormControl>
								<InputLabel>Estado Físico</InputLabel>
								<Select
									label={'productStatus'}
									id={'productStatus'}
									name={'productStatus'}
									value={''}
									onChange={(e) => null}
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
								id={'comments'}
								name={'comments'}
								label={'Comentarios'}
								value={''}
								onChange={() => null}
							/>
						</Grid>
						<Grid item xs={8}>
							<Autocomplete
								freeSolo
								forcePopupIcon={true}
								options={searchedClients}
								getOptionLabel={(option) =>
									typeof option === 'string'
										? option
										: `${option.firstName + ' ' + option.firstLastName}`
								}
								autoComplete
								includeInputInList
								value={client.name}
								renderInput={(params) => (
									<TextField {...params} label={'Cliente'} />
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
													{option.firstName + ' ' + option.firstLastName}
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
								maxRows={4}
								id={'extraComments'}
								name={'extraComments'}
								label={'Observaciones'}
								value={''}
								onChange={() => null}
							/>
						</Grid>
						<Grid item>
							<FormControl>
								<InputLabel>Estatus</InputLabel>
								<Select
									label={'status'}
									id={'status'}
									name={'Estatus'}
									value={'PENDING'}
									onChange={(e) => null}
								>
									<MenuItem value={'PENDING'}>Pendiente</MenuItem>
									<MenuItem value={'FINISHED'}>Concluida</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
		</Fragment>
	);
};

NewRequestDialog.propTypes = {
	refetchRequests: PropTypes.func.isRequired,
};

export default NewRequestDialog;
