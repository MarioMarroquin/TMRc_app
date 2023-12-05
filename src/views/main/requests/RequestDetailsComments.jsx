import { Fragment, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { GridRowEditStopReasons, GridRowModes } from '@mui/x-data-grid';
import CustomDataGrid from '@components/customDataGrid';
import { format } from 'date-fns';
import { useMutation } from '@apollo/client';
import { CREATE_REQUEST_COMMENT } from '@views/main/requests/mutationRequests';
import toast from 'react-hot-toast';
import { SCOPES_GENERAL } from '@config/permisissions/permissions';
import PermissionsGate from '@components/PermissionsGate';
import { useSession } from '@providers/session';
import { pxToRem } from '@config/theme/functions';
import { Typography } from '@mui/material';

const DataGridCommentHeaders = [
	{
		field: 'createdAt',
		headerName: 'Fecha',
		headerAlign: 'left',
		width: 150,
		align: 'center',
		valueFormatter: (params) => {
			return format(new Date(params.value), 'dd/MM/yy - HH:mm');
		},
	},
	{
		field: 'comment',
		headerName: 'Comentario',
		flex: 1,
		headerAlign: 'left',
		align: 'left',
		renderCell: (params) => (
			<Typography my={pxToRem(10)} variant={'primaryLight14'}>
				{params.value}
			</Typography>
		),
		editable: true,
	},
];

const RequestDetailsComments = ({ requestId, comments, refetch, SCOPE }) => {
	const [commentsAux, setCommentsAux] = useState([]);
	const [rowModesModel, setRowModesModel] = useState({});
	const [editingRow, setEditingRow] = useState();
	const { role } = useSession();

	const [createRequestComment] = useMutation(CREATE_REQUEST_COMMENT);

	const handleRowEditStop = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleSaveClick = () => {
		setRowModesModel({
			...rowModesModel,
			[editingRow]: { mode: GridRowModes.View },
		});
	};

	const processRowUpdate = (newRow) => {
		const toastId = toast.loading('Creando...');

		const updatedRow = { ...newRow, isNew: false };

		const requestComment = { requestId, comment: newRow?.comment };

		createRequestComment({ variables: { requestComment } })
			.then((res) => {
				if (!res.errors) {
					toast.dismiss(toastId);
					refetch();
				} else {
					toast.error('Intentalo de nuevo', {
						id: toastId,
					});
				}
			})
			.catch((error) => {
				console.log('Error al comentar: ', error);
				toast.error('Ha ocurrido un error', {
					id: toastId,
				});
			});
	};

	const handleNewComment = () => {
		const id = -1;

		setEditingRow(id);

		setCommentsAux((pastCommentsAux) => [
			{ id, createdAt: new Date(), comment: '', isNew: true },
			...pastCommentsAux,
		]);

		setRowModesModel((pastModel) => ({
			...pastModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: 'comment' },
		}));
	};

	const isNewRow = rowModesModel[editingRow]?.mode === GridRowModes.Edit;

	useEffect(() => {
		if (comments) {
			setCommentsAux(comments);
		}
	}, [comments]);

	return (
		comments && (
			<Fragment>
				<PermissionsGate scopes={[SCOPES_GENERAL.total, SCOPE]}>
					<Button
						color='primary'
						startIcon={isNewRow ? <SaveIcon /> : <AddIcon />}
						onClick={isNewRow ? handleSaveClick : handleNewComment}
						sx={{ width: 'fit-content', alignSelf: 'flex-end' }}
					>
						{isNewRow ? 'Guardar' : 'Agregar comentario'}
					</Button>
				</PermissionsGate>

				<CustomDataGrid
					rows={commentsAux}
					columns={DataGridCommentHeaders}
					editMode='row'
					rowModesModel={rowModesModel}
					onRowEditStop={handleRowEditStop}
					processRowUpdate={processRowUpdate}
					disableRowSelectionOnClick
					initialState={{
						pagination: { paginationModel: { pageSize: 5 } },
					}}
					getRowHeight={() => 'auto'}
				/>
			</Fragment>
		)
	);
};

RequestDetailsComments.propTypes = {};

export default RequestDetailsComments;
