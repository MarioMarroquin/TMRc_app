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
import {
	Avatar,
	Box,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material';
import { AddComment, ModeComment } from '@mui/icons-material';
import { es } from 'date-fns/locale';

const RequestDetailsComments = ({ requestId, comments, refetch, SCOPE }) => {
	const [commentsAux, setCommentsAux] = useState([]);
	const [rowModesModel, setRowModesModel] = useState({});
	const [editingRow, setEditingRow] = useState();
	const { role } = useSession();

	const [createRequestComment] = useMutation(CREATE_REQUEST_COMMENT);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column' }}>
			<List disablePadding>
				{comments.slice(0, 3).map((comment, index, commentsArray) => (
					<ListItem disablePadding>
						<ListItemAvatar
							sx={{
								...(commentsArray.length > index + 1 && {
									'&::before': {
										top: '50%',
										content: '""',
										position: 'absolute',
										height: '100%',
										width: '2px',
										bgcolor: 'divider',
										left: 'calc(20px)',
									},
								}),
							}}
						>
							<Avatar variant={'rounded'}>
								<ModeComment />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={comment.comment}
							secondary={
								<Stack direction={'row'} justifyContent={'space-between'}>
									<Typography fontSize={12} fontWeight={600}>
										-{' '}
										{`${comment.createdBy.firstName} ${comment.createdBy.lastName[0]}.`}
									</Typography>
									<Typography fontSize={12} fontWeight={500}>
										{format(new Date(comment.createdAt), 'dd/MM/yyyy - HH:mm', {
											locale: es,
										})}
									</Typography>
								</Stack>
							}
							primaryTypographyProps={{
								fontSize: 14,
								fontWeight: 500,
								mb: '4px',
							}}
						/>
					</ListItem>
				))}
				<PermissionsGate scopes={[SCOPES_GENERAL.total, SCOPE]}>
					<ListItemButton sx={{ borderRadius: 1 }} disableGutters>
						<ListItemAvatar>
							<Avatar
								sx={{ bgcolor: 'transparent', color: '#000' }}
								variant={'rounded'}
							>
								<AddComment />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={'Agregar nuevo comentario'}
							primaryTypographyProps={{
								fontSize: 14,
								fontWeight: 600,
							}}
						/>
					</ListItemButton>
				</PermissionsGate>
			</List>

			{comments.length > 3 && (
				<Button sx={{ ml: 'auto' }} variant={'text'}>
					Ver todos
				</Button>
			)}
		</Box>
	);
};

RequestDetailsComments.propTypes = {};

export default RequestDetailsComments;
