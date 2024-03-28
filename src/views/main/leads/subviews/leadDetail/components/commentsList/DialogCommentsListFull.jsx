import PropTypes from 'prop-types';
import {
	Avatar,
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { ROLES, SCOPES_GENERAL } from '@config/permisissions/permissions';
import { LoadingButton } from '@mui/lab';
import { AddComment, ModeComment } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PermissionsGate from '@components/PermissionsGate';
import Button from '@mui/material/Button';

const DialogCommentsListFull = ({ comments, open, onExit }) => {
	return (
		<Dialog
			fullWidth
			open={open}
			maxWidth={'sm'}
			onClose={onExit}
			scroll={'paper'}
		>
			<DialogTitle>Comentarios</DialogTitle>
			<DialogContent>
				<DialogContentText fontSize={12} fontWeight={500}>
					Comentarios de seguimiento
				</DialogContentText>

				<Box sx={{ display: 'flex', flexDirection: 'column', p: 8 }}>
					<List disablePadding>
						{comments.map((comment, index, commentsArray) => (
							<ListItem key={index} disablePadding>
								<ListItemAvatar
									sx={{
										...(commentsArray.length > index + 1 && {
											'&::before': {
												top: '50%',
												content: '""',
												position: 'absolute',
												height: '100%',
												width: '1px',
												bgcolor: 'divider',
												left: 'calc(20px)',
											},
										}),
									}}
								>
									<Avatar
										sx={{ bgcolor: 'transparent', color: '#8a8a8a' }}
										variant={'rounded'}
									>
										<ModeComment />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={comment.comment}
									secondary={
										<Stack direction={'row'} justifyContent={'space-between'}>
											<Typography fontSize={11} fontWeight={500}>
												-{' '}
												{`${comment.createdBy.firstName} ${comment.createdBy.lastName[0]}.`}
											</Typography>
											<Typography fontSize={11} fontWeight={400}>
												{format(
													new Date(comment.createdAt),
													'dd/MM/yyyy - HH:mm',
													{
														locale: es,
													}
												)}
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
					</List>
				</Box>
			</DialogContent>
			<DialogActions>
				<LoadingButton onClick={onExit}>Salir</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

DialogCommentsListFull.propTypes = {};

export default DialogCommentsListFull;
