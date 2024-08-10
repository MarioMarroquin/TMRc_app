import { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { pxToRem } from '@config/theme/functions';
import {
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Grid,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Person, PersonSearch, Search, Sync, Tune } from '@mui/icons-material';
import {
	ROLES,
	SCOPES_GENERAL,
	SCOPES_REQUEST,
} from '@config/permisissions/permissions';
import PermissionsGate from '@components/PermissionsGate';
import { useSession } from '@providers/session';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { GET_SELLERS_ALL } from '@views/main/requests/queryRequests';
import toast from 'react-hot-toast';
import DialogLeadCreate from '@views/main/leads/DialogLeadCreate/DialogLeadCreate';
import LeadsMaterialReactTable from '@views/main/leads/components/LeadsMaterialReactTable';
import CustomDateRange from '@components/customDateRange';
import DrawerLeadsMenu from '@views/main/leads/DrawerLeadsMenu';
import useLeads from '@views/main/leads/useLeads';
import {
	defaultInputRanges,
	defaultStaticRanges,
} from '@utils/functions/defaultRanges';

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
		value={props.value.firstName + ' ' + props.value.lastName}
		renderInput={(params) => (
			<TextField
				{...params}
				InputProps={{
					...params.InputProps,
					startAdornment: (
						<InputAdornment sx={{ mr: 0, ml: pxToRem(8) }} position='start'>
							<PersonSearch />
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
						<Typography color='text.secondary'>
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

const Leads = (props) => {
	const { role } = useSession();
	const navigate = useNavigate();
	const [sellersList, setSellersList] = useState([]);
	const { filterMenu, allLeads, assignedUser, date, leads, pending } =
		useLeads();

	const [searchSellers] = useLazyQuery(GET_SELLERS_ALL);

	const onChangeSeller = (event, value) => {
		// console.log('value', value);
		if (!value) {
			assignedUser.onChange({
				...assignedUser.selected,
				id: undefined,
				firstName: '',
				lastName: '',
			});
		} else {
			assignedUser.onChange({
				...assignedUser.selected,
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

	// useInterval(refetch, 1000 * 60 * 1, {
	// 	skip: false,
	// 	leading: true,
	// });
	//

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
					justifyContent: 'flex-end',
					mt: 8,
					mb: 16,
				}}
			>
				<Button
					color={'secondary'}
					onClick={() => {
						const toastId = toast.loading('Actualizando...');
						leads.fetch().then((res) => {
							console.log('Actualizado', res);

							toast.success('Actualizado', { id: toastId });
						});
					}}
				>
					<Sync />
				</Button>

				<DialogLeadCreate refetchRequests={leads.fetch} />
			</Box>

			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					justifyContent: 'flex-end',
				}}
			>
				<PermissionsGate
					scopes={[
						SCOPES_GENERAL.total,
						SCOPES_REQUEST.total,
						SCOPES_REQUEST.filterOperator,
					]}
				>
					<Stack width={'100%'} sx={{ mb: { xs: 8, sm: 0 } }}>
						<Typography fontSize={12} fontWeight={500} ml={'4px'}>
							Asesor
						</Typography>
						<CustomAutocomplete
							options={sellersList}
							value={assignedUser.selected}
							onChange={onChangeSeller}
							// onInputChange={onInputSeller}
						/>
					</Stack>
				</PermissionsGate>

				<Divider
					orientation='vertical'
					variant='middle'
					flexItem
					sx={{
						mx: 16,
						borderColor: 'red',
						height: '100%',
						display: { xs: 'none', sm: 'flex' },
					}}
				/>

				<Stack direction={'row'}>
					<Stack width={'100%'}>
						<Typography fontSize={12} fontWeight={500} ml={'4px'}>
							Rango de fecha
						</Typography>
						<CustomDateRange
							ranges={date.dateRange}
							onChange={(item) => {
								item.selection.endDate.setHours(23, 59, 59);
								item.selection.startDate.setHours(0, 0, 0);
								date.setDateRange([item.selection]);
							}}
							fetch={leads.fetch}
							renderStaticRangeLabel={() => <Typography>lol</Typography>}
							staticRanges={defaultStaticRanges}
							inputRanges={defaultInputRanges}
						/>
					</Stack>
					<Button
						variant={'text'}
						sx={{ mt: 'auto', ml: 16 }}
						onClick={filterMenu.onOpen}
					>
						<Tune />
					</Button>
				</Stack>
			</Box>

			<Box sx={{ mt: 16, bgcolor: 'white', borderRadius: 8 }}>
				<LeadsMaterialReactTable
					data={leads.list}
					loading={leads.loading}
					goToRequest={goToRequest}
				/>
			</Box>

			<DrawerLeadsMenu
				allLeads={allLeads}
				pendingLeads={pending}
				onClose={filterMenu.onClose}
				open={filterMenu.visible}
			/>
		</Fragment>
	);
};

Leads.propTypes = {};

export default Leads;
