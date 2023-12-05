import { useNavigate, useParams } from 'react-router-dom';
import { useLoading } from '@providers/loading';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { ProductStatus, RequestStatus, ServiceType } from '@utils/enums';
import { format } from 'date-fns';
import { pxToRem } from '@config/theme/functions';
import {
	CancelPresentation,
	Flag,
	PriceCheck,
	Sync,
} from '@mui/icons-material';
import RequestEdit from './RequestEdit';
import RequestUploadDocumentDialog from '@views/main/requests/RequestUploadDocumentDialog';
import CustomDataGrid from '@components/customDataGrid';
import { GET_REQUEST } from '@views/main/requests/queryRequests';
import {
	FINISH_REQUEST,
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

const REQUESTSTATUS = {
	1: 'TRACING',
	2: 'FINISHED',
};

const RequestDetails = (props) => {
	const { id } = useParams();
	const { setLoading } = useLoading();
	const navigate = useNavigate();
	const [request, setRequest] = useState();
	const [documents, setDocuments] = useState([]);
	const [commentsByManager, setCommentsByManager] = useState([]);
	const [commentsByOperator, setCommentsByOperator] = useState([]);

	const { data, loading, refetch } = useQuery(GET_REQUEST, {
		variables: { requestId: Number(id) }, // tiene que ser Number porque params lo hace string
	});

	const [traceRequest] = useMutation(TRACE_REQUEST);
	const [finishRequest] = useMutation(FINISH_REQUEST);

	useEffect(() => {
		if (loading) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loading]);

	useEffect(() => {
		setLoading(true);
		if (data) {
			console.log('weird data', data);
			const {
				__typename,
				documents,
				operatorComments,
				managerComments,
				...aux
			} = data.request;
			console.log('lopolll', aux);
			setRequest(aux);
			setDocuments(documents);
			setCommentsByOperator(operatorComments);
			setCommentsByManager(managerComments);
		}
		setLoading(false);
	}, [data]);

	const changeRequestStatus = (status, sale = false) => {
		setLoading(true);

		if (REQUESTSTATUS[status] === 'TRACING') {
			traceRequest({ variables: { requestId: Number(id) } })
				.then((res) => {
					console.log(res);
					refetch();
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		} else if (REQUESTSTATUS[status] === 'FINISHED') {
			finishRequest({
				variables: {
					requestId: Number(id),
					sale,
				},
			})
				.then((res) => {
					console.log(res);
					refetch();
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		}
	};

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

	const DataGridCommentHeaders = [
		{
			field: 'createdAt',
			headerName: 'Fecha',
			headerAlign: 'left',
			align: 'center',
			valueFormatter: (params) => {
				return format(new Date(params.value), 'dd/MM/yyyy - HH:mm');
			},
		},
		{
			field: 'comment',
			headerName: 'Fecha',
			headerAlign: 'left',
			align: 'center',
			valueFormatter: (params) => {
				return format(new Date(params.value), 'dd/MM/yyyy - HH:mm');
			},
		},
	];

	return (
		<Fragment>
			<Box
				sx={{
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
					<Box
						sx={{
							mb: pxToRem(16),
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
						}}
					>
						<Stack>
							<Typography variant={'primaryLight12'}>Fecha</Typography>
							{request && (
								<Typography variant={'primaryNormal14'}>
									{format(new Date(request.requestDate), 'dd/MM/yyyy - HH:mm')}
								</Typography>
							)}

							<Divider sx={{ my: pxToRem(4) }} />

							<Typography variant={'primaryLight12'}>Estatus</Typography>
							<Typography variant={'primaryNormal14'}>
								{request?.requestStatus
									? RequestStatus[request?.requestStatus]
									: 'N/D'}
							</Typography>
						</Stack>

						<PermissionsGate
							scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.interact]}
						>
							<Button
								variant={'contained'}
								color={'info'}
								startIcon={<Flag />}
								sx={{
									ml: 'auto',
									display:
										request?.requestStatus === REQUESTSTATUS[1] ||
										request?.isSale !== null
											? 'none'
											: 'inline-flex',
								}}
								disabled={
									request?.requestStatus === REQUESTSTATUS[1] ||
									request?.isSale !== null
								}
								onClick={() => {
									changeRequestStatus(1);
								}}
							>
								En curso
							</Button>
						</PermissionsGate>
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
									<Grid item xs={3}>
										<Stack>
											<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
												Medio de Contacto
											</Typography>
											<Typography variant={'primaryNormal14'}>
												{request?.contactMedium || 'Sin definir'}
											</Typography>
										</Stack>
									</Grid>
									<Grid item xs={3}>
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

									<Grid item xs={6}>
										<Stack>
											<Typography
												variant={'secondaryLight12'}
												mb={pxToRem(4)}
												align={'right'}
											>
												Tipo de Servicio
											</Typography>
											<Typography variant={'primaryNormal14'} align={'right'}>
												{request?.serviceType
													? ServiceType[request.serviceType]
													: 'N/D'}
											</Typography>
										</Stack>
									</Grid>

									<Grid item xs={3}>
										<Typography variant={'secondaryLight12'} mb={pxToRem(4)}>
											Marca
										</Typography>
										<Typography variant={'primaryNormal14'}>
											{request?.brand?.name}
										</Typography>
									</Grid>
									<Grid item xs={3}>
										<Typography
											variant={'secondaryLight12'}
											mb={pxToRem(4)}
											align={'right'}
										>
											Estatus de producto
										</Typography>
										<Typography variant={'primaryNormal14'} align={'right'}>
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
						<Button
							variant={'contained'}
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
							<Typography variant={'primaryNormal13'}>
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
							<Stack sx={{ m: '2px auto 0' }}>
								<Button
									sx={{ my: pxToRem(4) }}
									variant={'contained'}
									color={'success'}
									startIcon={<PriceCheck />}
									disabled={request?.isSale !== null}
									onClick={() => {
										changeRequestStatus(2, true);
									}}
								>
									Completar venta
								</Button>
								<Button
									sx={{ my: pxToRem(4) }}
									variant={'contained'}
									color={'error'}
									startIcon={<CancelPresentation />}
									disabled={request?.isSale !== null}
									onClick={() => {
										changeRequestStatus(2);
									}}
								>
									Rechazar venta
								</Button>
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
						<Typography variant={'primaryBold14'}>Documentos</Typography>

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
