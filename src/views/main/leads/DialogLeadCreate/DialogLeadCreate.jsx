import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
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
import { DateTimeField } from '@mui/x-date-pickers';
import { ROLES } from '@config/permisissions/permissions';
import useLeadCreate from '@views/main/leads/DialogLeadCreate/useLeadCreate';

const DialogLeadCreate = ({ refetchRequests }) => {
	const theme = useTheme();
	const [isVisible, setIsVisible] = useState(false);
	const toggleDialog = () => setIsVisible((prev) => !prev);
	const {
		useSeller,
		useBrand,
		useCompany,
		useClient,
		lead,
		setLead,
		handleInputLead,
		cleanStates,
		userRole,
		onFinish,
	} = useLeadCreate(refetchRequests, toggleDialog, isVisible);

	// const isAv = () => {
	// 	return Boolean(client.firstName);
	// };

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
									value={
										useSeller.selectedSeller.id === null
											? null
											: (
													useSeller.selectedSeller.firstName +
													' ' +
													useSeller.selectedSeller.lastName
											  ).trim()
									}
									onChange={useSeller.handleSelectedSeller}
									inputValue={useSeller.input}
									onInputChange={(event, newInputValue) =>
										useSeller.setInput(newInputValue)
									}
									options={useSeller.sellersList}
									renderInput={(params) => <TextField {...params} />}
									disabled={userRole === ROLES.salesOperator}
									getOptionLabel={(option) =>
										typeof option === 'string'
											? option
											: `${option.firstName + ' ' + option.lastName}`
									}
									isOptionEqualToValue={(option, value) => {
										return option.id === useSeller.selectedSeller.id;
									}}
									loading={useSeller.loading}
								/>
							</Grid>

							<Grid item xs={12} sm={5} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Fecha
								</Typography>
								<DateTimeField
									sx={{ m: 0 }}
									value={lead.requestDate}
									format={'dd MMM yy - HH:mm'}
									onChange={(newValue) =>
										setLead({ ...lead, requestDate: newValue })
									}
								/>
							</Grid>

							<Grid item xs={12} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Marca
								</Typography>
								<Autocomplete
									getOptionKey={(option) => option.id}
									freeSolo
									forcePopupIcon={true}
									options={useBrand.foundBrands}
									getOptionLabel={(option) =>
										typeof option === 'string' ? option : option.name
									}
									autoComplete
									includeInputInList
									ListboxProps={{ style: { padding: 0 } }}
									value={useBrand.brand.name}
									renderInput={(params) => <TextField {...params} />}
									loading={useBrand.loading}
									onInputChange={useBrand.handleInputBrand}
									onChange={useBrand.handleSelectedBrand}
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
										value={lead.serviceType}
										onChange={handleInputLead}
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
										value={lead.productStatus}
										onChange={handleInputLead}
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
										value={lead.contactMedium}
										onChange={handleInputLead}
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
									value={lead.advertisingMedium}
									onChange={handleInputLead}
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
									value={lead.comments}
									onChange={handleInputLead}
								/>
							</Grid>
						</Grid>

						<Grid item container xs={12} sm={6}>
							<Grid item xs={12} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Compañías
								</Typography>
								<Autocomplete
									getOptionKey={(option) => option.id}
									freeSolo
									forcePopupIcon={true}
									options={useCompany.foundCompanies}
									getOptionLabel={(option) =>
										typeof option === 'string' ? option : option.name
									}
									autoComplete
									includeInputInList
									ListboxProps={{ style: { padding: 0 } }}
									value={useCompany.company.name}
									renderInput={(params) => <TextField {...params} />}
									loading={useCompany.loading}
									onInputChange={useCompany.handleInputCompany}
									onChange={useCompany.handleSelectedCompany}
								/>
							</Grid>

							<Grid item xs={12} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Correo Empresa
								</Typography>
								<TextField
									id={'email'}
									name={'email'}
									value={useCompany.company.email}
									onChange={useCompany.handleInputEmail}
									disabled={useCompany.company.id || !useCompany.company.name}
								/>
							</Grid>

							<Grid item xs={12} sm={6} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Nombre de Cliente
								</Typography>
								<Autocomplete
									freeSolo
									forcePopupIcon={true}
									options={useClient.foundClients}
									getOptionLabel={(option) =>
										typeof option === 'string' ? option : option.firstName
									}
									autoComplete
									includeInputInList
									value={useClient.client.firstName}
									renderInput={(params) => <TextField {...params} />}
									loading={useClient.loading}
									onInputChange={useClient.handleInputClientName}
									onChange={useClient.handleSelectedClient}
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
									value={useClient.client.lastName}
									onChange={useClient.handleInputClientLastName}
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
									value={useClient.client.email}
									onChange={useClient.handleInputEmail}
									disabled={
										useClient.client.id ||
										!(useClient.client.firstName && useClient.client.lastName)
									}
								/>
							</Grid>
							<Grid item xs={12} sm={6} sx={{ p: 4 }}>
								<Typography fontSize={12} fontWeight={500} ml={'4px'}>
									Número (cliente)
								</Typography>
								<TextField
									id={'phoneNumber'}
									name={'phoneNumber'}
									value={useClient.client.phoneNumber}
									onChange={useClient.handleInputNumber}
									disabled={
										useClient.client.id ||
										!(useClient.client.firstName && useClient.client.lastName)
									}
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
									value={useCompany.company.phoneNumber}
									onChange={useCompany.handleInputNumber}
									disabled={useCompany.company.id || !useCompany.company.name}
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
								value={lead.extraComments}
								onChange={handleInputLead}
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
