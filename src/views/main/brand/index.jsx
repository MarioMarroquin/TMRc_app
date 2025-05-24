import { useQuery } from '@apollo/client';
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
import EditIcon from '@mui/icons-material/Edit';
import useWindowDimensions from '@hooks/use-windowDimensions';
import toast from 'react-hot-toast';
import { GET_BRANDS } from './queryBrand';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

const Index = () => {
	const { height } = useWindowDimensions();
	const [paginationState, setPaginationState] = useState({
		page: 0,
		pageSize: 10,
	});

	const { data, loading, error, refetch } = useQuery(GET_BRANDS, {
		variables: {
			params: {
				page: paginationState.page,
				pageSize: paginationState.pageSize,
			},
		},
		fetchPolicy: 'cache-and-network',
		onError: (error) => {
			toast.error(`Error al cargar las marcas: ${error.message}`);
		},
	});

	const defaultColDef = useMemo(
		() => ({
			filter: true,
			floatingFilter: true,
			sortable: true,
			resizable: true,
			minWidth: 100,
		}),
		[]
	);

	const columnDefs = useMemo(
		() => [
			{
				field: 'id',
				headerName: 'ID',
				width: 100,
				filter: 'agNumberColumnFilter',
			},
			{
				field: 'name',
				headerName: 'Nombre',
				flex: 1,
				filter: 'agTextColumnFilter',
			},
			{
				field: 'createdBy.username',
				headerName: 'Creado por',
				flex: 1,
			},
			{
				field: 'createdBy.role',
				headerName: 'Rol',
				width: 120,
			},
			{
				field: 'createdBy.createdAt',
				headerName: 'Fecha Creación',
				flex: 1,
				filter: 'agDateColumnFilter',
				valueFormatter: (params) => {
					if (!params.value) return '';
					return new Date(params.value).toLocaleDateString('es-ES', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
					});
				},
			},
			{
				headerName: 'Acciones',
				width: 120,
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
		],
		[]
	);

	const handleEdit = (brand) => {
		console.log('Editar marca:', brand);
		// Implementar lógica de edición
	};

	const handleCreateNew = () => {
		// Implementar lógica para crear nueva marca
		console.log('Crear nueva marca');
	};

	const onGridReady = (params) => {
		params.api.sizeColumnsToFit();
	};

	if (loading && !data) {
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
							<Toolbar
								variant='dense'
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									mb: 2,
								}}
							>
								<Button
									variant='contained'
									color='primary'
									onClick={handleCreateNew}
								>
									Nueva Marca
								</Button>
								{loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
							</Toolbar>
							<div
								className='ag-theme-quartz'
								style={{
									height: height - 150,
									width: '100%',
								}}
							>
								<AgGridReact
									rowData={data?.brands?.results || []}
									columnDefs={columnDefs}
									defaultColDef={defaultColDef}
									pagination={true}
									paginationPageSize={paginationState.pageSize}
									onPaginationChanged={(params) => {
										const currentPage = params.api.paginationGetCurrentPage();
										setPaginationState((prev) => ({
											...prev,
											page: currentPage,
										}));
									}}
									animateRows={true}
									onGridReady={onGridReady}
									getRowId={(params) => params.data.id}
									rowSelection='single'
									suppressLoadingOverlay={true}
									enableCellTextSelection={true}
								/>
							</div>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default Index;
