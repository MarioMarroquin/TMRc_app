import { Fragment, useEffect, useState } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { es } from 'date-fns/locale';
import useInterval from '@hooks/use-interval';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@providers/session';
import { pxToRem } from '@config/theme/functions';
import { useRequests } from '@providers/requests';
import { useLazyQuery, useQuery } from '@apollo/client';
import PermissionsGate from '@components/PermissionsGate';
import CustomDateRange from '@components/customDateRange';
import { Person, Search, Sync } from '@mui/icons-material';
import RequestCreate from '@views/main/requests/RequestCreate';
import RequestsMaterialTable from '@views/main/requests/RequestsMaterialTable';
import {
	Autocomplete,
	Box,
	Button,
	Divider,
	Grid,
	InputAdornment,
	Stack,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import {
	ROLES,
	SCOPES_GENERAL,
	SCOPES_REQUEST,
} from '@config/permisissions/permissions';
import {
	GET_REQUESTS,
	GET_SELLERS_ALL,
} from '@views/main/requests/queryRequests';

const CustomAutocomplete = (props) => (
	<Autocomplete
		freeSolo
		fullWidth
		autoComplete
		includeInputInList
		forcePopupIcon={true}
		options={props.options}
		getOptionLabel={(option) =>
			typeof option === 'string'
				? option
				: `${option.firstName + ' ' + option.lastName}`
		}
		value={props.value.name}
		renderInput={(params) => (
			<TextField
				{...params}
				margin={'none'}
				placeholder={'Asesor'}
				InputProps={{
					...params.InputProps,
					startAdornment: (
						<InputAdornment sx={{ mr: 0, ml: pxToRem(8) }} position='start'>
							<Search />
						</InputAdornment>
					),
				}}
			/>
		)}
		// onInputChange={props.onInputChange}
		onChange={props.onChange}
		renderOption={(props, option) => (
			<li {...props} key={option.id}>
				<Grid container alignItems='center'>
					<Grid>
						<Box component={Person} sx={{ color: 'text.secondary', mr: 2 }} />
					</Grid>
					<Grid xs>
						<Typography variant='body2' color='text.secondary'>
							{option?.firstName + ' ' + option?.lastName}
						</Typography>
					</Grid>
				</Grid>
			</li>
		)}
	/>
);

CustomAutocomplete.propTypes = {
	options: PropTypes.array,
	value: PropTypes.object,
	onInputChange: PropTypes.func,
	onChange: PropTypes.func,
};

const Requests = (props) => {
	const {
		setCountRows,
		showPending,
		setShowPending,
		paginationModel,
		dateRange,
		setDateRange,
		showAll,
		setShowAll,
		selectedSeller,
		setSelectedSeller,
		resetFilters,
	} = useRequests();
	const { role, liveDate } = useSession();
	const navigate = useNavigate();
	const [requests, setRequests] = useState([]);
	const [sellersList, setSellersList] = useState([]);

	const [searchSellers] = useLazyQuery(GET_SELLERS_ALL);

	const { data, loading, refetch } = useQuery(GET_REQUESTS, {
		variables: {
			showAll,
			pending: showPending,
			assignedUserId: selectedSeller.id,
			dateRange: {
				end: dateRange[0].endDate,
				start: dateRange[0].startDate,
			},
			params: {
				page: paginationModel.pageIndex,
				pageSize: paginationModel.pageSize,
			},
		},
	});

	const onChangeSeller = (event, value) => {
		// console.log('value', value);
		if (!value) {
			setSelectedSeller({
				...selectedSeller,
				id: undefined,
				firstName: '',
				lastName: '',
			});
		} else {
			setSelectedSeller({
				...selectedSeller,
				id: value.id,
				firstName: value.firstName,
				lastName: value.lastName,
			});
		}
	};
	const goToRequest = (data) => {
		const id = data.id;
		navigate(`${id}`); // needs to be string for route params
	};

	useInterval(refetch, 1000 * 60 * 1, {
		skip: false,
		leading: true,
	});

	useEffect(() => {
		if (data) {
			const aux = data.requests.results;
			const auxCount = data.requests.info.count;

			// console.log('aux', aux);
			// console.log('auxCount', auxCount);
			setRequests(aux);
			setCountRows(auxCount);
		}
	}, [data]);

	useEffect(() => {
		if (role !== ROLES.salesOperator)
			searchSellers().then((res) => {
				const aux = res.data.sellers.results;
				setSellersList(aux);
			});
	}, []);

	return (
		<Fragment>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<Box
					sx={{
						width: { xs: '60%', lg: '65%', xl: '75%' },
						display: 'flex',
						flexDirection: 'column',
						px: pxToRem(22),
					}}
				>
					<Stack flexDirection={'row'}>
						<PermissionsGate
							scopes={[
								SCOPES_GENERAL.total,
								SCOPES_REQUEST.total,
								SCOPES_REQUEST.filterOperator,
							]}
						>
							<CustomAutocomplete
								options={sellersList}
								value={selectedSeller}
								onChange={onChangeSeller}
								// onInputChange={onInputSeller}
							/>
						</PermissionsGate>
						<Button
							variant={'contained'}
							color={'secondary'}
							sx={{ ml: pxToRem(16) }}
							onClick={() => {
								refetch();
							}}
						>
							<Sync />
						</Button>
					</Stack>

					<Stack
						flexDirection={'row'}
						justifyContent={'flex-end'}
						mt={pxToRem(32)}
						mb={pxToRem(4)}
						px={pxToRem(16)}
					>
						<Stack flexDirection={'row'} alignItems={'center'}>
							<Switch
								color={'secondary'}
								checked={showPending}
								onChange={(event) => {
									setShowPending(event.target.checked);
								}}
							/>
							<Typography variant={'primaryLight12'}>
								Mostrar pendientes
								{/* {!showPending ? 'Mostrar pendientes' : 'Pendientes'} */}
							</Typography>
						</Stack>

						<PermissionsGate
							scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST.filterOperator]}
						>
							<Fragment>
								<Divider
									orientation='vertical'
									variant='middle'
									flexItem
									sx={{ ml: pxToRem(12) }}
								/>

								<Stack flexDirection={'row'} alignItems={'center'}>
									<Switch
										color={'secondary'}
										checked={!showAll}
										onChange={(event) => {
											setShowAll(!event.target.checked);
										}}
									/>
									<Typography variant={'primaryLight12'}>
										Mostrar mis asignadas
										{/* {showAll ? 'Mostrar mis asignadas' : 'Mis asignadas'} */}
									</Typography>
								</Stack>
							</Fragment>
						</PermissionsGate>
					</Stack>
					<Box
						sx={{
							display: 'flex',
							p: pxToRem(14),
							borderRadius: 1,
							boxShadow: `0px 3px 6px rgba(0, 0, 0, 0.04),
													0px 10px 25px rgba(0, 0, 0, 0.07);`,
						}}
					>
						<RequestsMaterialTable
							data={requests}
							loading={loading}
							goToRequest={goToRequest}
						/>
					</Box>
				</Box>

				<Box
					sx={{
						width: { xs: '40%', lg: '35%', xl: '25%' },

						display: 'flex',
						flexDirection: 'column',
						px: pxToRem(22),
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Stack>
							<Typography variant={'primaryLight16'} mb={pxToRem(4)}>
								{format(liveDate, "EEEE',' d 'de' MMM", { locale: es })}
							</Typography>
							<Typography variant={'primaryBold32'}>
								{format(liveDate, 'HH:mm', { locale: es })}
							</Typography>
						</Stack>
						<RequestCreate refetchRequests={refetch} />
					</Box>

					<Typography
						variant={'primaryLight12'}
						mt={pxToRem(29)}
						ml={pxToRem(8)}
						mb={pxToRem(15)}
					>
						Filtro de fecha
					</Typography>
					<Box
						sx={{
							display: 'flex',
							p: pxToRem(14),
							borderRadius: 1,
							boxShadow: `0px 3px 6px rgba(0, 0, 0, 0.04),
													0px 10px 25px rgba(0, 0, 0, 0.07);`,
						}}
					>
						<CustomDateRange
							ranges={dateRange}
							onChange={(item) => {
								item.selection.endDate.setHours(23, 59, 59);
								item.selection.startDate.setHours(0, 0, 0);
								setDateRange([item.selection]);
							}}
							extended
						/>

						{/* <Button */}
						{/* 	sx={{ alignSelf: 'flex-end', mt: pxToRem(8) }} */}
						{/* 	variant={'outlined'} */}
						{/* 	onClick={() => { */}
						{/* 		resetFilters(); */}
						{/* 	}} */}
						{/* 	startIcon={<RestartAlt />} */}
						{/* > */}
						{/* 	Restablecer */}
						{/* </Button> */}
					</Box>
				</Box>
			</Box>
		</Fragment>
	);
};

Requests.propTypes = {};

export default Requests;
