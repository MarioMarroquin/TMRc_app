import { useQuery } from '@apollo/client';
import { GET_COMPANIES } from './requests';
import { Fragment, useMemo, useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	Toolbar,
	CircularProgress,
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import CompanyCreateDialog from './CompanyCreateDialog';
import EditIcon from '@mui/icons-material/Edit';
import useWindowDimensions from '@hooks/use-windowDimensions';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

const Companies = () => {
	const { height } = useWindowDimensions();
	const [companies, setCompanies] = useState([]);

	const { data, loading, refetch } = useQuery(GET_COMPANIES, {
		variables: {
			params: {
				page: 0,
				pageSize: 100, // Ajusta según necesites
			},
		},
	});

	const defaultColDef = useMemo(() => {
		return {
			filter: true,
			floatingFilter: true,
		};
	}, []);

	const columnDefs = [
		{
			field: 'id',
			headerName: 'ID',
			flex: 0.5,
			filter: true,
		},
		{
			field: 'name',
			headerName: 'Nombre',
			flex: 1,
			filter: true,
		},
		{
			field: 'phoneNumber',
			headerName: 'Teléfono',
			flex: 1,
			valueFormatter: (params) => {
				return params.value?.replace('+52', '');
			},
		},
		{
			field: 'email',
			headerName: 'Correo',
			flex: 1.2,
		},
		{
			field: 'website',
			headerName: 'Sitio Web',
			flex: 1.2,
		},
		{
			headerName: 'Acciones',
			flex: 1,
			sortable: false,
			filter: false,
			cellRenderer: (params) => (
				<Box
					sx={{
						display: 'flex',
						gap: 1,
						justifyContent: 'center',
					}}
				>
					<Button
						variant='contained'
						size='small'
						startIcon={<EditIcon />}
						onClick={() => handleEdit(params.data)}
						sx={{
							minWidth: 'auto',
							fontSize: '0.7rem',
							padding: '3px 8px',
						}}
					>
						Editar
					</Button>
				</Box>
			),
		},
	];

	const handleEdit = (company) => {
		// Implementa la lógica de edición aquí
		console.log('Editar compañía:', company);
	};

	if (loading) {
		return (
			<Box display='flex' justifyContent='center' mt={4}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Fragment>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Card>
						<CardContent>
							<Toolbar variant='dense'>
								<CompanyCreateDialog reloadCompanies={refetch} />
							</Toolbar>
							<div
								className='ag-theme-quartz'
								style={{
									height: height - 150,
									width: '100%',
								}}
							>
								<AgGridReact
									rowData={data?.companies?.results || []}
									columnDefs={columnDefs}
									defaultColDef={defaultColDef}
									pagination={true}
									paginationAutoPageSize={true}
									animateRows={true}
									getRowId={(params) => params.data.id}
								/>
							</div>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default Companies;
