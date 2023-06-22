import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	LinearProgress,
	Toolbar,
} from '@mui/material';
import CustomDataGrid from '../../../components/customDataGrid';
import { endOfDay, endOfMonth, format, startOfMonth } from 'date-fns';
import {
	ProductStatus,
	RequestStatus,
	ServiceType,
} from '../../../utils/enums';
import { headers } from './headers';
import { useLoading } from '../../../providers/loading';
import { useQuery } from '@apollo/client';
import { GET_REQUESTS } from './requests';
import NewRequestDialog from './components/newRequestDialog';
import { useNavigate } from 'react-router-dom';
import CustomDateRange from '@components/customDateRange';
import { es } from 'date-fns/locale';

const Requests = (props) => {
	const { setLoading } = useLoading();
	const navigate = useNavigate();
	const [columnVisibilityModel, setColumnVisibilityModel] = useState({
		contactMedium: false,
		advertisingMedium: false,
		user: false,
		brand: false,
		productStatus: false,
		comments: false,
		company: false,
		client: false,
		extraComments: false,
	});

	const [requests, setRequests] = useState([]);
	const [countRows, setCountRows] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 5,
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
			<Card sx={{ boxShadow: 'unset' }}>
				<CardContent>
					<Box sx={{ display: 'flex', flexDirection: 'row' }}>
						<CustomDateRange
							ranges={dateRange}
							onChange={(item) => {
								item.selection.endDate.setHours(23, 59, 59);
								item.selection.startDate.setHours(0, 0, 0);
								setDateRange([item.selection]);
							}}
						/>
						<NewRequestDialog refetchRequests={refetch} />
					</Box>
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
		</Fragment>
	);
};

Requests.propTypes = {};

export default Requests;
