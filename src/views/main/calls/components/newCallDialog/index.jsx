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
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { useLoading } from '@providers/loading';
import { LocationOn } from '@mui/icons-material';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { CREATE_CALL, GET_CLIENTS } from './requests';
import useDebounce from '@hooks/use-debounce';
import { pxToRem } from '@config/theme/functions';
import { DateTimePicker } from '@mui/x-date-pickers';

const InitialCall = {
	callTime: new Date(),
	duration: 1,
	phoneNumber: '',
	purpose: '',
	type: 'INGOING',
};

const InitialClient = {
	id: '',
	firstName: '',
	lastName: '',
	get name() {
		return (this.firstName + ' ' + this.lastName).trim();
	},
};

const NewCallDialog = (props) => {
	const { setLoading } = useLoading();

	const [searchedClients, setSearchedClients] = useState([]);
	const [toWhom, setToWhom] = useState(InitialClient);
	const [call, setCall] = useState(InitialCall);
	const [isVisible, setIsVisible] = useState(false);

	const [searchClients, { data, loading }] = useLazyQuery(GET_CLIENTS, {
		variables: { text: toWhom.firstName },
	});

	const [createCall] = useMutation(CREATE_CALL);

	const debouncedValue = useDebounce(call, 1000);

	const resetState = () => {
		setCall(InitialCall);
		setToWhom(InitialClient);
	};

	const toggleDialog = () => {
		setIsVisible(!isVisible);
		resetState();
	};

	const handlePhoneChange = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setCall({ ...call, phoneNumber });
		} else {
			if (/^\d+$/.test(phoneNumber)) setCall({ ...call, phoneNumber });
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (e.target.type === 'number') {
			if (value === '') {
				setCall({ ...call, [name]: '' });
			} else {
				setCall({ ...call, [name]: Number(value) });
			}
		} else {
			setCall({ ...call, [name]: value });
		}
	};

	const handleInputOnChangeAddress = (event, value) => {
		if (!value) {
			setToWhom({
				...toWhom,
				id: '',
				firstName: '',
				lastName: '',
			});
		} else {
			setToWhom({
				...toWhom,
				id: value.id,
				firstName: value.firstName,
				lastName: value.lastName,
			});
		}
	};

	const handleInputChangeAddress = (event, value) => {
		const lastName = toWhom.name;
		const actualId = toWhom.id;

		if (!value) {
			setToWhom({
				...toWhom,
				id: '',
				firstName: '',
				lastName: '',
			});
		} else if (
			lastName.length > value.length ||
			(lastName.length < value.length && actualId.length)
		) {
			setToWhom({
				...toWhom,
				id: '',
				firstName: value,
				lastName: '',
			});
		} else {
			setToWhom({
				...toWhom,
				firstName: value,
			});
		}
	};

	const check = () => {
		return false;
	};

	const onFinish = (e) => {
		setLoading(true);
	};

	// fetch data from server
	useEffect(() => {
		searchClients();
	}, [debouncedValue]);

	useEffect(() => {
		if (data) {
			const aux = data.searchClients.results;
			setSearchedClients(aux);
		}
	}, [data]);

	const [value, setValue] = useState(new Date('2022-04-07'));

	return (
		<Fragment>
			<Button onClick={toggleDialog}>Registrar</Button>

			<Dialog open={isVisible} onClose={toggleDialog} maxWidth={'md'} fullWidth>
				<DialogTitle>Registrar llamada</DialogTitle>
				<DialogContent>
					<Typography>Llamada</Typography>

					<Grid container columnSpacing={{ xs: 0, sm: 2 }}>
						<Grid item container columnSpacing={1} xs={12} sm={6}>
							<Grid item xs={8}>
								<TextField
									id={'phoneNumber'}
									name={'phoneNumber'}
									label={'Teléfono'}
									value={call.phoneNumber}
									onChange={handlePhoneChange}
									inputProps={{ maxLength: 10, inputMode: 'numeric' }}
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>+52</InputAdornment>
										),
									}}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									fullWidth
									type='number'
									id={'duration'}
									name={'duration'}
									label={'Duración'}
									value={call.duration}
									onChange={handleInputChange}
									inputProps={{ min: 0 }}
									onKeyDown={(event) => {
										if (
											event?.key === '-' ||
											event?.key === '+' ||
											event?.key === '.' ||
											event?.key === 'e'
										) {
											event.preventDefault();
										}
									}}
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
											: `${option.firstName + ' ' + option.lastName}`
									}
									autoComplete
									includeInputInList
									value={toWhom.name}
									renderInput={(params) => (
										<TextField {...params} label={'Cliente'} />
									)}
									loading={loading}
									onInputChange={handleInputChangeAddress}
									onChange={handleInputOnChangeAddress}
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
							<Grid item xs={4} display={'flex'}>
								<FormControl>
									<InputLabel>Tipo</InputLabel>
									<Select
										label={'Tipo'}
										id={'type'}
										name={'type'}
										value={call.type}
										onChange={(e) => setCall({ ...call, type: e.target.value })}
									>
										<MenuItem value={'INGOING'}>Entrante</MenuItem>
										<MenuItem value={'OUTGOING'}>Saliente</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						</Grid>

						<Grid item container xs={12} sm={6}>
							<Grid item xs={12}>
								<DateTimePicker
									renderInput={(props) => <TextField {...props} />}
									label='Fecha'
									value={value}
									formatDensity={'spacious'}
									sx={{
										'&.Mui-selected': {
											color: 'secondary',
										},
									}}
									onChange={(newValue) => {
										console.log(newValue);
										setValue(newValue);
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									multiline
									maxRows={4}
									id={'purpose'}
									name={'purpose'}
									label={'Motivo'}
									value={call.purpose}
									onChange={handleInputChange}
								/>
							</Grid>
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

NewCallDialog.propTypes = {
	reloadCalls: PropTypes.func,
};

export default NewCallDialog;
