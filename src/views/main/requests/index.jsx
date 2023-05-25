import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import {
	Button,
	Card,
	CardContent,
	LinearProgress,
	Toolbar,
} from '@mui/material';
import CustomDataGrid from '../../../components/customDataGrid';
import { format } from 'date-fns';
import {
	ProductStatus,
	RequestStatus,
	ServiceType,
} from '../../../utils/enums';
import { headers } from './headers';
import { useLoading } from '../../../providers/loading';
import { useQuery } from '@apollo/client';
import { GET_REQUESTS } from './requests';

const Requests = (props) => {
	const { setLoading } = useLoading();
	const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

	const [requests, setRequests] = useState([]);
	const [countRows, setCountRows] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 5,
	});

	const { data, loading, refetch } = useQuery(GET_REQUESTS, {
		variables: {
			params: {
				page: paginationModel.page,
				pageSize: paginationModel.pageSize,
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

	return (
		<Fragment>
			<Card>
				<CardContent>
					<Toolbar variant={'dense'}>
						<Button>Abrir</Button>
					</Toolbar>
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
					/>
				</CardContent>
			</Card>
		</Fragment>
	);
};

Requests.propTypes = {};

export default Requests;
