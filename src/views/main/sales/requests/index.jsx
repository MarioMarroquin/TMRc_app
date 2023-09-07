import { Fragment, useEffect, useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	LinearProgress,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import CustomDataGrid from '@components/customDataGrid';
import { endOfMonth, startOfMonth } from 'date-fns';
import { headers } from './headers';
import { useLoading } from '@providers/loading';
import { useQuery } from '@apollo/client';
import { GET_REQUESTS } from './requests';
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
		productStatus: false,
		comments: false,
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
		},
	});

	useEffect(() => {
		if (data) {
			const aux = data.sellerRequestsBySeller.results;
			const auxCount = data.sellerRequestsBySeller.info.count;
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
							<Button
								variant={'text'}
								color={'info'}
								sx={{ ml: 'auto' }}
								startIcon={<Update />}
								onClick={() => {
									refetch();
								}}
							>
								{useMediaQuery(theme.breakpoints.down('sm'))
									? ''
									: 'Actualizar'}
							</Button>
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
