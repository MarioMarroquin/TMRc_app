import { useQuery } from '@apollo/client';
import { GET_COMPANIES } from '@views/main/desk/companies/requests';
import { Fragment, useEffect, useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	LinearProgress,
	Toolbar,
} from '@mui/material';
import CustomDataGrid from '@components/customDataGrid';
import NewCompanyDialog from './components/newCompanyDialog';

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
				return params.value?.replace('+52', '');
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
		{
			field: 'options',
			headerName: 'Opciones',
			headerAlign: 'left',
			align: 'left',
			width: 200,
			renderCell: (params) => {
				<Box sx={{ bgcolor: 'red', width: '100%' }}>
					<Button>lol</Button>
				</Box>;
			},
		},
	];

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
