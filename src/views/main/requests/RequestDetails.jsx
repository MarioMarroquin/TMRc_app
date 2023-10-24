import { useNavigate, useParams } from 'react-router-dom';
import { useLoading } from '@providers/loading';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
import { ProductStatus, RequestStatus, ServiceType } from '@utils/enums';
import { format } from 'date-fns';
import { pxToRem } from '@config/theme/functions';
import { ChevronLeft } from '@mui/icons-material';
import RequestEditDialog from './RequestEditDialog';
import PermissionsGate from '@components/PermissionsGate';
import {
	REQUESTDETAILSSCOPES,
	SCOPES,
	SCOPESREQUEST,
} from '@config/permisissions/permissions';
import RequestOperatorCommentDialog from '@views/main/requests/RequestOperatorCommentDialog';
import RequestUploadDocumentDialog from '@views/main/requests/RequestUploadDocumentDialog';
import CustomDataGrid from '@components/customDataGrid';
import { GET_REQUEST } from '@views/main/requests/queryRequests';
import {
	FINISH_REQUEST,
	TRACE_REQUEST,
} from '@views/main/requests/mutationRequests';

const REQUESTSTATUS = {
	1: 'TRACING',
	2: 'FINISH',
};

const RequestDetails = (props) => {
	const { id } = useParams();
	const { setLoading } = useLoading();
	const navigate = useNavigate();
	const [request, setRequest] = useState();
	const [documents, setDocuments] = useState([]);

	const { data, loading, refetch } = useQuery(GET_REQUEST, {
		variables: { requestId: Number(id) },
	});

	const [traceRequest] = useMutation(TRACE_REQUEST);
	const [finishRequest] = useMutation(FINISH_REQUEST);

	useEffect(() => {
		setLoading(true);
		if (data) {
			const { __typename, docs, ...aux } = data.request;
			console.log('lopolll', aux);
			setRequest(aux);
			setDocuments(docs);
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
		} else if (REQUESTSTATUS[status] === 'FINISH') {
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

	const headers = [
		{
			field: 'title',
			headerName: 'NOMBRE DE ARCHIVO',
			headerAlign: 'left',
			align: 'left',
			flex: 0.7,
			minWidth: 200,
		},
		{
			field: 'fileURL',
			headerName: 'URL',
			headerAlign: 'center',
			align: 'center',
			flex: 0.3,

			minWidth: 200,
		},
	];

	return (
		<Fragment>
			<Button
				variant={'text'}
				startIcon={<ChevronLeft />}
				sx={{ mb: pxToRem(16) }}
				onClick={() => {
					navigate('/requests');
				}}
			>
				atrás
			</Button>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Card>
						<CardHeader title='Detalles de Solicitud' />
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
									width: '100%',
									flexWrap: 'wrap',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'center',
										width: { xs: '100%', sm: 'unset' },
									}}
								>
									<Stack mr={pxToRem(25)}>
										<Typography fontWeight={700} fontSize={pxToRem(14)}>
											Asesor
										</Typography>
										<Typography>
											{request?.assignedUser.firstName}{' '}
											{request?.assignedUser.lastName}
										</Typography>
									</Stack>
									<Stack mr={pxToRem(25)}>
										<Typography fontWeight={700} fontSize={pxToRem(14)}>
											Estatus
										</Typography>
										<Typography>
											{request?.requestStatus
												? RequestStatus[request?.requestStatus]
												: 'N/D'}
										</Typography>
									</Stack>
									<Stack>
										<Typography fontWeight={700} fontSize={pxToRem(14)}>
											Venta
										</Typography>
										<Typography>
											{request?.isSale
												? 'Si'
												: request?.isSale === false
												? 'No'
												: 'N/D'}
										</Typography>
									</Stack>
								</Box>

								<PermissionsGate
									scopes={[REQUESTDETAILSSCOPES.interact, SCOPES.total]}
								>
									<Box
										sx={{
											marginX: { xs: 'auto', md: 'unset' },
											mt: { xs: pxToRem(16), sm: 'unset' },
										}}
									>
										<Button
											variant={'outlined'}
											color={'info'}
											sx={{
												mr: 2,
												display:
													request?.requestStatus === REQUESTSTATUS[1] ||
													request?.isSale !== null
														? 'none'
														: 'inline',
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
										<Button
											variant={'outlined'}
											color={'success'}
											sx={{ mr: 2 }}
											disabled={request?.isSale !== null}
											onClick={() => {
												changeRequestStatus(2, true);
											}}
										>
											Completar venta
										</Button>
										<Button
											variant={'outlined'}
											color={'error'}
											disabled={request?.isSale !== null}
											onClick={() => {
												changeRequestStatus(2);
											}}
										>
											Rechazar venta
										</Button>
									</Box>
								</PermissionsGate>
							</Box>

							<Divider sx={{ mt: 2 }} />
							<Box
								sx={{
									display: 'flex',
									justifyContent: { xs: 'center', sm: 'flex-end' },
									padding: pxToRem(8),
								}}
							>
								<Stack sx={{ mr: 2 }}>
									<Typography fontWeight={700} fontSize={pxToRem(14)}>
										Fecha
									</Typography>
									{request && (
										<Typography>
											{format(
												new Date(request.requestDate),
												'dd/MM/yyyy - HH:mm'
											)}
										</Typography>
									)}
								</Stack>
								<Stack>
									<Typography fontWeight={700} fontSize={pxToRem(14)}>
										Tipo de Servicio
									</Typography>
									<Typography align={'right'}>
										{request?.serviceType
											? ServiceType[request.serviceType]
											: 'N/D'}
									</Typography>
								</Stack>
							</Box>

							<Divider sx={{ mt: 2 }} />

							<Grid container sx={{ m: 0, p: 2 }} rowSpacing={2}>
								<Grid item xs={6} sm={3}>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Medio de Contacto
									</Typography>
									<Typography>{request?.contactMedium}</Typography>
								</Grid>

								<Grid item xs={6} sm={3}>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Medio de Publicidad
									</Typography>
									<Typography>{request?.advertisingMedium}</Typography>
								</Grid>

								<Grid item xs={6} sm={3} md={3}>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Marca
									</Typography>
									<Typography>{request?.brand?.name}</Typography>
								</Grid>

								<Grid item xs={6} sm={3}>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Estatus de producto
									</Typography>
									<Typography>
										{request?.productStatus
											? ProductStatus[request?.productStatus]
											: 'N/D'}
									</Typography>
								</Grid>

								<Grid item xs={12}>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Comentarios
									</Typography>
									<Typography>{request?.comments}</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Empresa
									</Typography>
									<Typography>{request?.company?.name}</Typography>
									<Typography color={'text.primaryLight'} fontSize={14}>
										{request?.company?.phoneNumber} {request?.company?.email}
									</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Cliente
									</Typography>
									<Typography>
										{request?.client?.firstName} {request?.client?.lastName}
									</Typography>

									<Typography color={'text.primaryLight'} fontSize={14}>
										{request?.client?.phoneNumber} {request?.client?.email}
									</Typography>
								</Grid>

								<Grid item xs={12}>
									<Typography fontWeight={700} fontSize={pxToRem(12)}>
										Observaciones
									</Typography>
									<Typography>{request?.extraComments}</Typography>
								</Grid>

								<Grid item xs={12}>
									<Stack
										flexDirection={'row'}
										justifyContent={'flex-start'}
										alignItems={'center'}
									>
										<Typography
											fontWeight={700}
											fontSize={pxToRem(12)}
											mr={pxToRem(35)}
										>
											Comentarios de vendedor
										</Typography>
										<RequestOperatorCommentDialog
											data={request}
											reloadRequest={refetch}
										/>
									</Stack>
									<Typography>{request?.operatorComments}</Typography>
								</Grid>

								<PermissionsGate
									scopes={[SCOPESREQUEST.interact, SCOPES.total]}
								>
									<Grid
										item
										xs={12}
										// sx={{
										// 	display:
										// 		request?.requestStatus === REQUESTSTATUS[1] ||
										// 		request?.requestStatus === REQUESTSTATUS[2]
										// 			? 'block'
										// 			: 'none',
										// }}
									>
										<Stack
											flexDirection={'row'}
											justifyContent={'flex-start'}
											alignItems={'center'}
										>
											<Typography
												fontWeight={700}
												fontSize={pxToRem(12)}
												mr={pxToRem(35)}
											>
												Documentos
											</Typography>

											<RequestUploadDocumentDialog
												reloadRequest={refetch}
												requestId={request?.id}
											/>
										</Stack>

										<CustomDataGrid
											rows={request?.documents ?? []}
											columns={headers}
											onRowClick={(data, e) => {
												console.log('LOLLLLL', data);
												open(data.row.fileURL);
											}}
										/>
									</Grid>
								</PermissionsGate>
							</Grid>
						</CardContent>
						<CardActions>
							<RequestEditDialog
								requestData={request}
								requestRefetch={refetch}
							/>
						</CardActions>
					</Card>
				</Grid>
			</Grid>
		</Fragment>
	);
};

RequestDetails.propTypes = {};

export default RequestDetails;
