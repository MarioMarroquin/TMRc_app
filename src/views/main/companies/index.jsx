import { useQuery } from '@apollo/client';
import { GET_COMPANIES } from '@views/main/companies/requests';
import { Fragment, useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	Grid,
	LinearProgress,
	Toolbar,
} from '@mui/material';
import CustomDataGrid from '@components/customDataGrid';
import { format } from 'date-fns';
import NewCompanyDialog from './components/newCompanyDialog';

const headers = [
	{
		field: 'name',
		headerName: 'Nombre',
		headerAlign: 'left',
		align: 'center',
		flex: 1,
		minWidth: 200,
	},
	{
		field: 'phoneNumber',
		headerName: 'TELÉFONO',
		headerAlign: 'left',
		align: 'center',
		minWidth: 150,
		valueFormatter: (params) => {
			return params.value.replace('+52', '');
		},
	},

	{
		field: 'email',
		headerName: 'CORREO',
		headerAlign: 'left',
		align: 'left',
		width: 200,
	},

	{
		field: 'website',
		headerName: 'SITIO WEB',
		headerAlign: 'left',
		align: 'left',
		width: 200,
	},
];

const Companies = () => {
	const [companies, setCompanies] = useState([]);
	const [countRows, setCountRows] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 5,
	});

	const { data, loading, refetch } = useQuery(GET_COMPANIES, {
		variables: {
			params: {
				page: paginationModel.page,
				pageSize: paginationModel.pageSize,
			},
		},
	});

	useEffect(() => {
		if (data) {
			const aux = data.companies.results;
			const auxCount = data.companies.info.count;

			setCountRows(auxCount);
			setCompanies(aux);
		}
	}, [data]);
	return (
		<Fragment>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Card>
						<CardContent>
							<Toolbar variant={'dense'}>
								<NewCompanyDialog reloadCompanies={refetch} />
							</Toolbar>
							<CustomDataGrid
								rows={companies}
								columns={headers}
								loading={loading}
								slots={{
									loadingOverlay: LinearProgress,
								}}
								slotProps={{ loadingOverlay: { color: 'secondary' } }}
								rowCount={countRows}
								paginationModel={paginationModel}
								onPaginationModelChange={setPaginationModel}
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default Companies;
