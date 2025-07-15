import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Switch,
	Typography,
	Stack,
	Alert,
	CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useUsers } from '@views/main/maintenance/users/useUsers.js';
import useWindowDimensions from '@hooks/use-windowDimensions';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

const CellStackRender = ({ children }) => (
	<Stack direction='row' spacing={1} alignItems='center'>
		{children}
	</Stack>
);

const UsersGrid = ({ users, doubleClickAction }) => {
	const { height, width } = useWindowDimensions();

	const defaultColDef = useMemo(() => {
		return {
			filter: true,
			floatingFilter: true,
		};
	}, []);

	const [colDefs, setColDefs] = useState([
		{ field: 'id', headerName: 'Id', flex: 1 },
		{ field: 'firstName', headerName: 'Nombre', flex: 1 },
		{ field: 'lastName', headerName: 'Apellido', flex: 1 },
		{ field: 'role', headerName: 'Rol', flex: 1 },
		{ field: 'username', headerName: 'NombreUsuario', flex: 1 },
		{ field: 'phoneNumber', headerName: 'Teléfono', flex: 1 },
		{ field: 'email', headerName: 'email', flex: 1 },
		{
			field: 'active',
			headerName: 'Estado',
			flex: 1.3,
			cellRenderer: ({ data }) => (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
						gap: 1,
					}}
				>
					<CellStackRender>
						<Box
							sx={{
								width: 10,
								height: 10,
								borderRadius: '50%',
								backgroundColor: data.active ? 'green' : 'gray',
							}}
						/>
						<Typography variant='body2'>
							{data.active ? 'Activo' : 'Desactivado'}
						</Typography>
					</CellStackRender>
					<Switch
						checked={data.active}
						// onChange={() => toggleActive(data.id)}
						size='small'
					/>
				</Box>
			),
		},
	]);

	const rows = users;

	if (users.loading) {
		return (
			<Box display='flex' justifyContent='center' mt={4}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<div
			className='ag-theme-quartz'
			style={{ height: height - 150 }} // the Data Grid will fill the size of the parent container
		>
			<AgGridReact
				rowData={rows}
				columnDefs={colDefs}
				defaultColDef={defaultColDef}
				getRowId={(params) => params.data.id}
				pagination={true}
				paginationAutoPageSize={true}
				animateRows={true}
				onRowDoubleClicked={doubleClickAction}
			/>
		</div>
	);
};

export default UsersGrid;
