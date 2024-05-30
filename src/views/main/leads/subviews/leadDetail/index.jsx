import React, { Fragment, useState } from 'react';
import {
	Box,
	Button,
	Grid,
	List,
	MenuItem,
	Stack,
	Typography,
} from '@mui/material';
import {
	ArrowBack,
	KeyboardArrowDown,
	NotificationAdd,
	Sync,
	UploadFile,
} from '@mui/icons-material';
import { pxToRem } from '@config/theme/functions';
import CustomMenu from '@components/customMenu';
import useLeadDetail from '@views/main/leads/subviews/leadDetail/useLeadDetail';
import {
	ProductStatus,
	RequestStatus,
	RequestStatusList,
	ServiceType,
} from '@utils/enums';
import PermissionsGate from '@components/PermissionsGate';
import {
	ROLES,
	SCOPES_GENERAL,
	SCOPES_REQUEST_DETAILS,
} from '@config/permisissions/permissions';
import LeadStatusDot from '@views/main/leads/components/LeadStatusDot';
import { format } from 'date-fns';
import ListItemAux from '@views/main/leads/subviews/leadDetail/components/ListItemAux';
import CommentsList from './components/commentsList';
import { useSession } from '@providers/session';
import toast from 'react-hot-toast';
import Documents from '@views/main/leads/subviews/leadDetail/components/documents';
import ListItemAux2 from '@views/main/leads/subviews/leadDetail/components/ListItemAux2';
import RequestEdit from '@views/main/requests/RequestEdit';
import DialogLeadEdit from '@views/main/leads/DialogLeadEdit/DialogLeadEdit';

const LeadDetail = (props) => {
	const {
		documents,
		commentsByManager,
		commentsByOperator,
		assignedUserId,
		lead,
		handleLeadStatus,
		refetch,
		renderCommentsList,
		userId,
		openDialogDocumentUpload,
		goToRequests,
		...hookLeadDetail
	} = useLeadDetail();
	const { role, user } = useSession();
	const [anchorMenu, setAnchorMenu] = useState(null);
	const handleOpenMenu = (event) => {
		setAnchorMenu(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorMenu(null);
	};

	return (
		<Fragment>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					pr: pxToRem(12),
					mt: pxToRem(8),
					mb: pxToRem(16),
				}}
			>
				<Button
					variant={'text'}
					startIcon={<ArrowBack />}
					onClick={goToRequests}
				>
					regresar
				</Button>

				{/* <Button sx={{ ml: 'auto' }} variant={'text'} onClick={() => {}}> */}
				{/* 	<NotificationAdd /> */}
				{/* </Button> */}

				<Box sx={{ ml: 'auto' }}>
					<PermissionsGate
						scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.edit]}
					>
						<DialogLeadEdit requestData={lead} requestRefetch={refetch} />
					</PermissionsGate>
				</Box>

				<PermissionsGate
					scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.interact]}
				>
					<Button
						sx={{ ml: 16 }}
						variant={'text'}
						onClick={() => {
							openDialogDocumentUpload(lead.id);
						}}
					>
						<UploadFile />
					</Button>
				</PermissionsGate>

				<Button
					sx={{ ml: 16 }}
					color={'secondary'}
					onClick={() => {
						const toastId = toast.loading('Actualizando...');
						refetch().then((res) => {
							console.log('Actualizado', res);

							toast.success('Actualizado', { id: toastId });
						});
					}}
				>
					<Sync />
				</Button>

				<Button
					sx={{ ml: 16 }}
					onClick={handleOpenMenu}
					endIcon={<KeyboardArrowDown />}
				>
					Acciones
				</Button>
				<CustomMenu
					anchorEl={anchorMenu}
					open={Boolean(anchorMenu)}
					onClose={handleCloseMenu}
				>
					<PermissionsGate
						scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.interact]}
					>
						<MenuItem
							key={0}
							disableRipple
							disabled={
								lead?.requestStatus !== RequestStatusList.PENDING.name ||
								lead?.isSale !== null
							}
							onClick={() => {
								handleLeadStatus('TRACING').then(() => {
									handleCloseMenu();
								});
							}}
						>
							<LeadStatusDot status={'TRACING'} />
							En curso
						</MenuItem>
						<MenuItem
							key={1}
							disableRipple
							disabled={
								lead?.requestStatus !== RequestStatusList.TRACING.name ||
								lead?.isSale !== null
							}
							onClick={() => {
								handleLeadStatus('QUOTED').then(() => {
									handleCloseMenu();
								});
							}}
						>
							<LeadStatusDot status={'QUOTED'} />
							Cotizado
						</MenuItem>
					</PermissionsGate>
					<MenuItem
						key={2}
						disableRipple
						disabled={lead?.isSale !== null}
						onClick={() => {
							handleLeadStatus('FINISHED', true).then(() => {
								handleCloseMenu();
							});
						}}
					>
						<LeadStatusDot status={'FINISHED'} isSale={true} />
						Completar
					</MenuItem>
					<MenuItem
						key={3}
						disableRipple
						disabled={lead?.isSale !== null}
						onClick={() => {
							handleLeadStatus('FINISHED', false).then(() => {
								handleCloseMenu();
							});
						}}
					>
						<LeadStatusDot status={'FINISHED'} />
						No concretado
					</MenuItem>
				</CustomMenu>
			</Box>

			<Grid container direction={'row'}>
				<Grid item xs={12} md={7}>
					<Box sx={{ p: 16 }}>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								borderRadius: 8,
								borderLeft: `8px solid #000`,
								p: 8,
							}}
						>
							<Stack justifyContent={'space-between'}>
								<Typography fontSize={12} fontWeight={400}>
									# &nbsp; {lead?.shortId}
								</Typography>
								<Stack direction={'row'} alignItems={'center'} mt={pxToRem(4)}>
									<LeadStatusDot
										status={lead?.requestStatus}
										isSale={lead?.isSale}
									/>
									<Typography fontSize={14} fontWeight={600} ml={pxToRem(6)}>
										{lead?.requestStatus
											? RequestStatus[lead?.requestStatus]
											: 'N/D'}
									</Typography>
								</Stack>
							</Stack>

							{userId !== lead?.assignedUser.id && ( // check if same user
								<Stack ml={'auto'}>
									<Typography fontSize={12} fontWeight={400}>
										Asignado:
									</Typography>
									<Typography
										color={'text.secondary'}
										fontSize={14}
										fontWeight={500}
										ml={'auto'}
									>
										{lead?.assignedUser.firstName} {lead?.assignedUser.lastName}
									</Typography>
								</Stack>
							)}
						</Box>

						<Box sx={{ mt: 16 }}>
							<List disablePadding>
								<ListItemAux
									name={'Fecha'}
									text={format(
										new Date(lead?.requestDate ?? new Date()),
										'dd/MM/yyyy - HH:mm'
									)}
								/>

								<ListItemAux
									name={'Medio de Contacto'}
									text={lead?.contactMedium}
								/>

								<ListItemAux
									name={'Medio de Publicidad'}
									text={lead?.advertisingMedium}
								/>

								<ListItemAux
									name={'Tipo de Servicio'}
									text={ServiceType[lead?.serviceType]}
								/>

								<ListItemAux name={'Marca'} text={lead?.brand.name} />

								<ListItemAux
									name={'Estatus de Producto'}
									text={ProductStatus[lead?.productStatus]}
								/>

								<ListItemAux name={'Comentarios'} text={lead?.comments} />
								<ListItemAux
									name={'Observaciones'}
									text={lead?.extraComments}
								/>
							</List>
						</Box>

						<Box sx={{ mt: 16 }}>
							<List disablePadding>
								<ListItemAux2
									info={'Empresa'}
									name={lead?.company?.name}
									phoneNumber={lead?.company?.phoneNumber}
									email={lead?.company?.email}
								/>

								<ListItemAux2
									info={'Cliente'}
									name={`${lead?.client?.firstName} ${lead?.client?.lastName}`}
									phoneNumber={lead?.client?.phoneNumber}
									email={lead?.client?.email}
								/>
							</List>
						</Box>

						<Typography fontSize={16} fontWeight={700} mt={16}>
							Documentos
						</Typography>
						<Documents
							documents={documents}
							onClose={hookLeadDetail.closeDialogDocumentUpload}
							open={hookLeadDetail.dialogDocumentUploadState.visible}
							leadId={hookLeadDetail.dialogDocumentUploadState.leadId}
							refetch={refetch}
						/>
					</Box>
				</Grid>

				<Grid item xs={12} md={5}>
					<Box sx={{ p: 16 }}>
						{renderCommentsList() && (
							<Fragment>
								<Typography fontSize={16} fontWeight={700}>
									{ROLES.salesOperator === role
										? 'Mi seguimiento'
										: 'Seguimiento de vendedor'}
								</Typography>
								<CommentsList
									assignedUser={lead?.assignedUser}
									comments={commentsByOperator}
									leadId={lead?.id}
									refetchRequest={refetch}
									SCOPE={SCOPES_REQUEST_DETAILS.commentOperator}
								/>
							</Fragment>
						)}

						<Typography fontSize={16} fontWeight={700} mt={pxToRem(16)}>
							{ROLES.salesOperator === role
								? 'Comentarios de gerente'
								: 'Mi seguimiento'}
						</Typography>
						<CommentsList
							assignedUser={lead?.assignedUser}
							comments={commentsByManager}
							leadId={lead?.id}
							refetchRequest={refetch}
							SCOPE={SCOPES_REQUEST_DETAILS.commentManager}
						/>
					</Box>
				</Grid>
			</Grid>
		</Fragment>
	);
};

LeadDetail.propTypes = {};

export default LeadDetail;
