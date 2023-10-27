import { Fragment, useEffect, useState } from 'react';
import {
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	LinearProgress,
	Stack,
	Switch,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import CustomDataGrid from '@components/customDataGrid';
import { headers } from './headersIndex';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import CustomDateRange from '@components/customDateRange';
import { pxToRem } from '@config/theme/functions';
import { FilterAltOff, Person, Update } from '@mui/icons-material';
import { useRequests } from '@providers/requests';
import NoRowsOverlay from '@components/NoRowsOverlay';
import useInterval from '@hooks/use-interval';
import RequestCreateDialog from '@views/main/requests/RequestCreateDialog';
import { useSession } from '@providers/session';
import {
	ROLES,
	SCOPES,
	SCOPESREQUEST,
} from '@config/permisissions/permissions';
import PropTypes from 'prop-types';
import PermissionsGate from '@components/PermissionsGate';
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
			<TextField {...params} margin={'none'} label={'Asesor'} />
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
	const { role } = useSession();
	const navigate = useNavigate();
	const [requests, setRequests] = useState([]);
	const {
		countRows,
		setCountRows,
		showPending,
		setShowPending,
		paginationModel,
		setPaginationModel,
		dateRange,
		setDateRange,
		columnVisibilityModel,
		setColumnVisibilityModel,
		showAll,
		setShowAll,
		selectedSeller,
		setSelectedSeller,
		resetFilters,
	} = useRequests();
	const [sellersList, setSellersList] = useState([]);
	const [inputSelectedSeller, setInputSelectedSeller] = useState('');
	const [searchSellers] = useLazyQuery(GET_SELLERS_ALL);

	const { data, loading, refetch } = useQuery(GET_REQUESTS, {
		variables: {
			params: {
				page: paginationModel.page,
				pageSize: paginationModel.pageSize,
			},
			dateRange: {
				end: dateRange[0].endDate,
				start: dateRange[0].startDate,
			},
			assignedUserId: selectedSeller.id,
			showAll: showAll,
			pending: showPending,
		},
	});

	const onChangeSeller = (event, value) => {
		console.log('value', value);
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

	useInterval(refetch, 1000 * 60 * 1, {
		skip: false,
		leading: true,
	});

	useEffect(() => {
		if (data) {
			const aux = data.requests.results;
			const auxCount = data.requests.info.count;
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

	const goToRequest = (data) => {
		const id = data.id;
		navigate(`${id}`); // needs to be string for route params
	};

	return (
		<Fragment>
			<Box sx={{ padding: `${pxToRem(0)} ${pxToRem(18)} ${pxToRem(18)}` }}>
				<Typography mb={pxToRem(12)} variant={'primaryBold20'}>
					Lista de solicitudes
				</Typography>

				<Card sx={{ mb: 2 }}>
					<CardContent>
						<Grid container spacing={2}>
							<Grid
								item
								sm={12}
								md={6}
								lg={3}
								display={'flex'}
								justifyContent={'flex-end'}
							>
								<Tooltip title={'Limpiar filtro'} placement={'top'}>
									<Button
										variant={'text'}
										onClick={() => {
											resetFilters();
										}}
									>
										<FilterAltOff />
									</Button>
								</Tooltip>
								<Stack flexDirection={'row'} alignItems={'center'}>
									<Typography variant={'caption'}>
										{!showPending ? 'Mostrar pendientes' : 'Pendientes'}
									</Typography>
									<Switch
										color={'secondary'}
										checked={showPending}
										onChange={(event) => {
											setShowPending(event.target.checked);
										}}
									/>
								</Stack>
							</Grid>
							<Grid item sm={12} lg={5} display={'flex'}>
								<PermissionsGate
									scopes={[SCOPESREQUEST.selectOperator, SCOPES.total]}
								>
									<Stack flexDirection={'row'} alignItems={'center'}>
										<Typography display={'block'} variant={'caption'}>
											{showAll ? 'Mostrar mis asignadas' : 'Mis asignadas'}
										</Typography>
										<Switch
											color={'secondary'}
											checked={!showAll}
											onChange={(event) => {
												setShowAll(!event.target.checked);
											}}
										/>
									</Stack>
								</PermissionsGate>
							</Grid>
						</Grid>
					</CardContent>
				</Card>

				<Card>
					<CardContent></CardContent>
				</Card>
			</Box>
		</Fragment>
	);
};

Requests.propTypes = {};

export default Requests;
