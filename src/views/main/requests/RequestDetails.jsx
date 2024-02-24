import { useNavigate, useParams } from 'react-router-dom';
import { useLoading } from '@providers/loading';
import React, { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
	Box,
	Button,
	Divider,
	Fab,
	Grid,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import {
	ProductStatus,
	RequestStatus,
	RequestStatusList,
	ServiceType,
} from '@utils/enums';
import { format } from 'date-fns';
import { pxToRem } from '@config/theme/functions';
import {
	ArrowBack,
	AssignmentTurnedIn,
	CancelPresentation,
	ContentPasteSearch,
	Flag,
	PriceCheck,
	RequestQuote,
	Sync,
	WatchLater,
} from '@mui/icons-material';
import RequestEdit from './RequestEdit';
import RequestUploadDocumentDialog from '@views/main/requests/RequestUploadDocumentDialog';
import CustomDataGrid from '@components/customDataGrid';
import { GET_REQUEST } from '@views/main/requests/queryRequests';
import {
	FINISH_REQUEST,
	QUOTED_REQUEST,
	TRACE_REQUEST,
} from '@views/main/requests/mutationRequests';
import toast from 'react-hot-toast';
import NoRowsOverlay from '@components/NoRowsOverlay';
import PermissionsGate from '@components/PermissionsGate';
import {
	SCOPES_GENERAL,
	SCOPES_REQUEST_DETAILS,
} from '@config/permisissions/permissions';
import RequestDetailsComments from '@views/main/requests/RequestDetailsComments';

const RequestDetails = (props) => {
	const { id } = useParams();
	const { setLoading } = useLoading();
	const navigate = useNavigate();
	const [request, setRequest] = useState();
	const [documents, setDocuments] = useState([]);
	const [commentsByManager, setCommentsByManager] = useState([]);
	const [commentsByOperator, setCommentsByOperator] = useState([]);

	useEffect(() => {
		if (data) {
			const {
				__typename,
				documents,
				operatorComments,
				managerComments,
				...aux
			} = data.request;
			setRequest(aux);
			setDocuments(documents);
			setCommentsByOperator(operatorComments);
			setCommentsByManager(managerComments);
		}
		console.log('Details: ', data);
	}, [data]);

	const DataGridDocsHeaders = [
		{
			field: 'title',
			headerName: 'NOMBRE',
			headerAlign: 'left',
			align: 'left',
			flex: 0.4,
		},
		{
			field: 'fileURL',
			headerName: 'URL',
			headerAlign: 'center',
			align: 'left',
			flex: 0.6,
		},
	];

	return (
		<Fragment>
			<Box
				sx={{
					mt: pxToRem(12),
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<Box
					sx={{
						width: '60%',
						display: 'flex',
						flexDirection: 'column',
						px: pxToRem(22),
					}}
				>
					<Stack
						flexDirection={'row'}
						justifyContent={'space-between'}
						alignItems={'center'}
						sx={{
							mb: pxToRem(16),
						}}
					>
						<Typography variant={'primaryLight12'}>
							# {request?.shortId}
						</Typography>
					</Stack>

					<Box
						sx={{
							mb: pxToRem(16),
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<Stack
							flexDirection={'row'}
							justifyContent={'space-between'}
							alignItems={'center'}
						>
							<Stack flexDirection={'row'} alignItems={'center'}>
								{
									{
										PENDING: <WatchLater color={'error'} />,
										TRACING: <ContentPasteSearch color={'warning'} />,
										QUOTED: <RequestQuote color={'info'} />,
										FINISHED: <AssignmentTurnedIn color={'success'} />,
									}[request?.requestStatus]
								}
								<Stack sx={{ ml: pxToRem(16) }}>
									<Typography variant={'primaryLight12'}>Estatus</Typography>
									<Typography variant={'primaryBold14'}>
										{request?.requestStatus
											? RequestStatus[request?.requestStatus]
											: 'N/D'}
									</Typography>
								</Stack>
							</Stack>

							<PermissionsGate
								scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.interact]}
							>
								<Button
									variant={'text'}
									color={'warning'}
									startIcon={<ContentPasteSearch />}
									sx={{
										ml: 'auto',
										display:
											request?.requestStatus !==
												RequestStatusList.PENDING.name ||
											request?.isSale !== null
												? 'none'
												: 'inline-flex',
									}}
									disabled={
										request?.requestStatus !== RequestStatusList.PENDING.name ||
										request?.isSale !== null
									}
									onClick={() => {
										changeRequestStatus('TRACING');
									}}
								>
									marcar en curso
								</Button>
							</PermissionsGate>

							<PermissionsGate
								scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.interact]}
							>
								<Button
									variant={'text'}
									color={'info'}
									startIcon={<RequestQuote />}
									sx={{
										ml: 'auto',
										display:
											request?.requestStatus !==
												RequestStatusList.TRACING.name ||
											request?.isSale !== null
												? 'none'
												: 'inline-flex',
									}}
									disabled={
										request?.requestStatus !== RequestStatusList.TRACING.name ||
										request?.isSale !== null
									}
									onClick={() => {
										changeRequestStatus('QUOTED');
									}}
								>
									marcar como cotizado
								</Button>
							</PermissionsGate>
						</Stack>
					</Box>

					<Grid container rowSpacing={pxToRem(26)}>
						<Grid item xs={12}>
							<Box
								sx={{
									height: '100%',
									p: pxToRem(14),
									borderRadius: 1,
									boxShadow: `5px 3px 10px rgba(25, 27, 32, 0.10),
															20px 10px 40px rgba(25, 27, 32, 0.10);
															`,
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<Grid container rowSpacing={2}>
									<Grid item xs={4}>
										<Stack>
											<Typography variant={'secondaryLight12'}>
												Fecha
											</Typography>
											{request && (
												<Typography variant={'primaryNormal14'}>
													{format(
														new Date(request.requestDate),
														'dd/MM/yyyy - HH:mm'
													)}
												</Typography>
											)}
										</Stack>
									</Grid>
									<Grid item xs={4}>
										<Stack>
											<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
												Medio de Contacto
											</Typography>
											<Typography variant={'primaryNormal14'}>
												{request?.contactMedium || 'Sin definir'}
											</Typography>
										</Stack>
									</Grid>
									<Grid item xs={4}>
										<Stack>
											<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
												Medio de Publicidad
											</Typography>
											<Typography
												variant={
													request?.advertisingMedium
														? 'primaryNormal14'
														: 'secondaryLight14'
												}
											>
												{request?.advertisingMedium || 'Sin definir'}
											</Typography>
										</Stack>
									</Grid>

									<Grid item xs={4}>
										<Stack>
											<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
												Tipo de Servicio
											</Typography>
											<Typography variant={'primaryNormal14'}>
												{request?.serviceType
													? ServiceType[request.serviceType]
													: 'N/D'}
											</Typography>
										</Stack>
									</Grid>

									<Grid item xs={4}>
										<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
											Marca
										</Typography>
										<Typography variant={'primaryNormal14'}>
											{request?.brand?.name}
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
											Estatus de producto
										</Typography>
										<Typography variant={'primaryNormal14'}>
											{request?.productStatus
												? ProductStatus[request?.productStatus]
												: 'N/D'}
										</Typography>
									</Grid>
								</Grid>
							</Box>
						</Grid>
						<Grid item xs>
							<Box
								sx={{
									display: 'flex',
									p: pxToRem(14),
									borderRadius: 1,
									boxShadow: `5px 3px 10px rgba(25, 27, 32, 0.10),
															20px 10px 40px rgba(25, 27, 32, 0.10);
															`,
								}}
							>
								<Grid container>
									<Grid item xs={6}>
										<Stack>
											<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
												Empresa
											</Typography>
											<Typography variant={'primaryNormal14'} mb={pxToRem(2)}>
												{request?.company?.name}
											</Typography>
											<Typography variant={'primaryNormal13'} mb={pxToRem(2)}>
												{request?.company?.phoneNumber}
											</Typography>
											<Typography variant={'primaryNormal13'}>
												{request?.company?.email}
											</Typography>
										</Stack>
									</Grid>

									<Grid item xs={6}>
										<Stack>
											<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
												Cliente
											</Typography>
											<Typography variant={'primaryNormal14'} mb={pxToRem(2)}>
												{request?.client?.firstName} {request?.client?.lastName}
											</Typography>

											<Typography variant={'primaryNormal13'} mb={pxToRem(2)}>
												{request?.client?.phoneNumber}
											</Typography>
											<Typography variant={'primaryNormal13'}>
												{request?.client?.email}
											</Typography>
										</Stack>
									</Grid>
								</Grid>
							</Box>
						</Grid>

						<Grid item xs={12}>
							<Box
								sx={{
									display: 'flex',
									p: pxToRem(14),
									borderRadius: 1,
									boxShadow: `5px 3px 10px rgba(25, 27, 32, 0.10),
															20px 10px 40px rgba(25, 27, 32, 0.10);
															`,
								}}
							>
								<Stack>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Comentarios
									</Typography>
									<Typography>{request?.comments}</Typography>
								</Stack>
							</Box>
						</Grid>

						<Grid item xs={12}>
							<Box
								sx={{
									display: 'flex',
									p: pxToRem(14),
									borderRadius: 1,
									boxShadow: `5px 3px 10px rgba(25, 27, 32, 0.10),
															20px 10px 40px rgba(25, 27, 32, 0.10);
															`,
								}}
							>
								<Stack>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Observaciones
									</Typography>
									<Typography>{request?.extraComments}</Typography>
								</Stack>
							</Box>
						</Grid>

						<Grid item xs={12}>
							<Box
								sx={{
									p: pxToRem(14),
									borderRadius: 1,
									boxShadow: `5px 3px 10px rgba(25, 27, 32, 0.10),
															20px 10px 40px rgba(25, 27, 32, 0.10);
															`,
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<Stack
									flexDirection={'row'}
									justifyContent={'space-between'}
									alignItems={'center'}
									width={'100%'}
								>
									<Typography
										fontWeight={700}
										fontSize={pxToRem(12)}
										mr={pxToRem(35)}
									>
										Comentarios de vendedor
									</Typography>
								</Stack>
								<RequestDetailsComments
									comments={commentsByOperator}
									requestId={request?.id}
									refetch={refetch}
									SCOPE={SCOPES_REQUEST_DETAILS.commentOperator}
								/>
							</Box>
						</Grid>

						<Grid item xs={12}>
							<Box
								sx={{
									p: pxToRem(14),
									borderRadius: 1,
									boxShadow: `5px 3px 10px rgba(25, 27, 32, 0.10),
															20px 10px 40px rgba(25, 27, 32, 0.10);
															`,
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<Stack
									flexDirection={'column'}
									justifyContent={'space-between'}
									width={'100%'}
								>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Comentarios de gerente
									</Typography>
									<RequestDetailsComments
										comments={commentsByManager}
										requestId={request?.id}
										refetch={refetch}
										SCOPE={SCOPES_REQUEST_DETAILS.commentManager}
									/>
								</Stack>
							</Box>
						</Grid>
					</Grid>
				</Box>

				<Box
					sx={{
						width: '40%',
						display: 'flex',
						flexDirection: 'column',
						px: pxToRem(22),
					}}
				>
					<Box
						sx={{
							mb: pxToRem(20),
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<PermissionsGate
							scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.edit]}
						>
							<RequestEdit requestData={request} requestRefetch={refetch} />
						</PermissionsGate>
					</Box>

					<Box
						sx={{
							mb: pxToRem(20),
							p: pxToRem(14),
							borderRadius: 1,
							boxShadow: `0px 3px 6px rgba(0, 0, 0, 0.04),
													0px 10px 25px rgba(0, 0, 0, 0.07);`,
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
						}}
					>
						<Stack>
							<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
								Asignado:
							</Typography>
							<Typography variant={'primaryNormal13'} mb={pxToRem(8)}>
								{request?.assignedUser.firstName}{' '}
								{request?.assignedUser.lastName}
							</Typography>

							<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
								Venta
							</Typography>
							<Typography variant={'primaryNormal13'}>
								{request?.isSale
									? 'Si'
									: request?.isSale === false
									? 'No'
									: 'N/D'}
							</Typography>
						</Stack>

						<PermissionsGate
							scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.interact]}
						>
							<Stack>
								<Typography
									variant={'primaryLight14'}
									align={'center'}
									mb={pxToRem(4)}
								>
									Finalizar solicitud
								</Typography>
								<Stack flexDirection={'row'}>
									<Tooltip
										title={'Completar'}
										slotProps={{
											popper: {
												modifiers: [
													{
														name: 'offset',
														options: {
															offset: [0, -10],
														},
													},
												],
											},
										}}
									>
										<Fab
											sx={{ mr: pxToRem(16) }}
											color={'success'}
											disabled={request?.isSale !== null}
											onClick={() => {
												changeRequestStatus('FINISHED', true);
											}}
										>
											<PriceCheck />
										</Fab>
									</Tooltip>
									<Tooltip
										title={'Rechazar'}
										slotProps={{
											popper: {
												modifiers: [
													{
														name: 'offset',
														options: {
															offset: [0, -10],
														},
													},
												],
											},
										}}
									>
										<Fab
											color={'error'}
											disabled={request?.isSale !== null}
											onClick={() => {
												changeRequestStatus('FINISHED');
											}}
										>
											<CancelPresentation />
										</Fab>
									</Tooltip>
								</Stack>
							</Stack>
						</PermissionsGate>
					</Box>

					<Box
						sx={{
							mb: pxToRem(16),
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
						}}
					>
						<Typography variant={'primaryBold22'}>Documentos</Typography>

						<PermissionsGate
							scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.interact]}
						>
							<RequestUploadDocumentDialog
								reloadRequest={refetch}
								requestId={request?.id ?? -1}
							/>
						</PermissionsGate>
					</Box>

					<Box
						sx={{
							p: pxToRem(14),
							borderRadius: 1,
							boxShadow: `0px 3px 6px rgba(0, 0, 0, 0.04),
													0px 10px 25px rgba(0, 0, 0, 0.07);`,
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<CustomDataGrid
							rows={documents}
							columns={DataGridDocsHeaders}
							onRowClick={(data, e) => {
								open(data.row.fileURL);
							}}
							slots={{
								noRowsOverlay: NoRowsOverlay,
							}}
							initialState={{
								pagination: { paginationModel: { pageSize: 5 } },
							}}
						/>
					</Box>
				</Box>
			</Box>
		</Fragment>
	);
};

RequestDetails.propTypes = {};

export default RequestDetails;
