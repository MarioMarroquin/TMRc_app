import { Fragment, useEffect, useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	LinearProgress,
	Stack,
	Switch,
	Typography,
	useTheme,
} from '@mui/material';
import CustomDataGrid from '@components/customDataGrid';
import { endOfMonth, startOfMonth } from 'date-fns';
import { headers } from './headers';
import { useLoading } from '@providers/loading';
import { useQuery } from '@apollo/client';
import { GET_REQUESTS } from './requests';
import NewRequestDialog from './components/newRequestDialog';
import { useNavigate } from 'react-router-dom';
import CustomDateRange from '@components/customDateRange';
import { pxToRem } from '@config/theme/functions';
import { Update } from '@mui/icons-material';

const Requests = (props) => {
	const theme = useTheme();
	const { setLoading } = useLoading();
	const navigate = useNavigate();
	const [columnVisibilityModel, setColumnVisibilityModel] = useState({
		contactMedium: false,
		advertisingMedium: false,
		brand: false,
		productStatus: false,
		comments: false,
		company: false,
		client: false,
		extraComments: false,
		updatedAt: false,
		createdAt: false,
	});

	const [requests, setRequests] = useState([]);
	const [countRows, setCountRows] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10,
	});

	const [dateRange, setDateRange] = useState([
		{
			startDate: startOfMonth(new Date()),
			endDate: endOfMonth(new Date()),
			key: 'selection',
		},
	]);

	const [showPending, setShowPending] = useState(false);

	const { data, loading, refetch } = useQuery(GET_REQUESTS, {
		variables: {
			params: {
				page: paginationModel.page,
				pageSize: paginationModel.pageSize,
			},
			pending: showPending,
			dateRange: {
				end: dateRange[0].endDate,
				start: dateRange[0].startDate,
			},
		},
	});

	useEffect(() => {
		if (data) {
			const aux = data.requests.results;
			const auxCount = data.requests.info.count;
			setRequests(aux);
			setCountRows(auxCount);
		}
	}, [data]);

	const goToRequest = (data) => {
		const id = data.id;
		navigate(id);
	};

	return (
		<Fragment>
			<Box sx={{ padding: `${pxToRem(0)} ${pxToRem(18)} ${pxToRem(18)}` }}>
				<Typography mb={2} variant={'h4'}>
					Lista de solicitudes
				</Typography>

				<Card sx={{ mb: 2 }}>
					<CardContent>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%',
								flexWrap: 'wrap',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									width: { xs: '100%', md: 'unset' },
								}}
							>
								<CustomDateRange
									ranges={dateRange}
									onChange={(item) => {
										item.selection.endDate.setHours(23, 59, 59);
										item.selection.startDate.setHours(0, 0, 0);
										setDateRange([item.selection]);
									}}
								/>
							</Box>

							<Stack flexDirection={'row'} alignItems={'center'}>
								<Typography variant={'caption'}>
									{!showPending ? 'Mostrar pendientes' : 'Mostrar todo'}
								</Typography>
								<Switch
									color={'secondary'}
									checked={showPending}
									onChange={(event) => {
										setShowPending(event.target.checked);
									}}
								/>
							</Stack>

							<Box
								sx={{
									marginX: { xs: 'auto', md: 'unset' },
									mt: { xs: pxToRem(16), md: 'unset' },
								}}
							>
								<Button
									color={'info'}
									sx={{ mr: 2 }}
									variant={'text'}
									startIcon={<Update />}
									onClick={() => {
										refetch();
									}}
								>
									Actualizar
								</Button>
								<NewRequestDialog refetchRequests={refetch} />
							</Box>
						</Box>
					</CardContent>
				</Card>

				<Card>
					<CardContent>
						<CustomDataGrid
							rows={requests}
							columns={headers}
							loading={loading}
							slots={{
								loadingOverlay: LinearProgress,
							}}
							slotProps={{ loadingOverlay: { color: 'secondary' } }}
							rowCount={countRows}
							paginationModel={paginationModel}
							onPaginationModelChange={setPaginationModel}
							columnVisibilityModel={columnVisibilityModel}
							onColumnVisibilityModelChange={(newModel) =>
								setColumnVisibilityModel(newModel)
							}
							onRowDoubleClick={(data, e) => goToRequest(data.row)}
						/>
					</CardContent>
				</Card>
			</Box>
		</Fragment>
	);
};

Requests.propTypes = {};

export default Requests;
