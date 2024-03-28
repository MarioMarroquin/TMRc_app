import { Fragment, useEffect } from 'react';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import { SCOPES_GENERAL } from '@config/permisissions/permissions';
import PermissionsGate from '@components/PermissionsGate';
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
import DialogCommentCreate from '@views/main/leads/subviews/leadDetail/components/commentsList/DialogCommentCreate';
import useCommentList from '@views/main/leads/subviews/leadDetail/components/commentsList/useCommentList';
import PropTypes from 'prop-types';
import DialogCommentsListFull from '@views/main/leads/subviews/leadDetail/components/commentsList/DialogCommentsListFull';

const CommentsList = ({
	leadId,
	comments,
	assignedUser,
	refetchRequest,
	SCOPE,
}) => {
	const { openDialogCreate, openDialogList, ...restUseCommentList } =
		useCommentList();

	return (
		<Fragment>
			<Box sx={{ display: 'flex', flexDirection: 'column', p: 8 }}>
				<List disablePadding>
					{comments.slice(0, 3).map((comment, index, commentsArray) => (
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
					{!comments.length && (
						<ListItem disablePadding>
							<Typography
								fontSize={12}
								fontWeight={400}
								color={'text.secondary'}
								mx={'auto'}
								my={8}
							>
								No hay comentarios
							</Typography>
						</ListItem>
					)}
					<PermissionsGate scopes={[SCOPES_GENERAL.total, SCOPE]}>
						<ListItemButton
							sx={{ borderRadius: 8 }}
							disableGutters
							onClick={() => {
								openDialogCreate(leadId);
							}}
						>
							<ListItemAvatar>
								<Avatar
									sx={{ bgcolor: 'transparent', color: '#3F3F3F75' }}
									variant={'rounded'}
								>
									<AddComment />
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary={'Agregar nuevo comentario'}
								primaryTypographyProps={{
									fontSize: 12,
									fontWeight: 500,
									color: '#3F3F3F',
								}}
							/>
						</ListItemButton>
					</PermissionsGate>
				</List>

				{comments.length > 3 && (
					<Button sx={{ ml: 'auto' }} variant={'text'} onClick={openDialogList}>
						Ver todos
					</Button>
				)}
			</Box>

			<DialogCommentCreate
				assignedUserId={assignedUser}
				loading={restUseCommentList.loading}
				onChange={restUseCommentList.commentInputChange}
				onCreate={restUseCommentList.createComment}
				onExit={restUseCommentList.closeDialogCreate}
				refetchRequest={refetchRequest}
				value={restUseCommentList.newComment}
				open={restUseCommentList.dialogCommentCreateState.visible}
				role={restUseCommentList.role}
				userId={restUseCommentList.userId}
			/>

			<DialogCommentsListFull
				comments={comments}
				open={restUseCommentList.dialogCommentsListFull}
				onExit={restUseCommentList.closeDialogList}
			/>
		</Fragment>
	);
};

CommentsList.propTypes = { comments: PropTypes.array };

export default CommentsList;
