import { useNavigate, useParams } from 'react-router-dom';
import { useLoading } from '@providers/loading';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_REQUEST, UPDATE_REQUEST_STATUS_SALE } from './requests';
import {
	Box,
	Button,
	Card,
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
import EditRequestDialog from '../editRequestDialog';
import toast from 'react-hot-toast';
import { ChevronLeft } from '@mui/icons-material';

const RequestDetails = (props) => {
	const { id } = useParams();
	const { setLoading } = useLoading();
	const navigate = useNavigate();
	const [request, setRequest] = useState();

	const { data, refetch } = useQuery(GET_REQUEST, {
		variables: { requestId: id },
	});

	useEffect(() => {
		setLoading(true);
		if (data) {
			const { __typename, ...aux } = data.request;
			setRequest(aux);
		}
		setLoading(false);
	}, [data]);

	const [updateRequest] = useMutation(UPDATE_REQUEST_STATUS_SALE);

	const changeRequest = (status) => {
		setLoading(true);

		updateRequest({ variables: { requestId: id, status } }).then(() => {
			refetch();
			toast.success('Solicitud actualizada');
			setLoading(false);
		});
	};

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

								<Box
									sx={{
										marginX: { xs: 'auto', sm: 'unset' },
										mt: { xs: pxToRem(16), sm: 'unset' },
									}}
								>
									<Button
										variant={'outlined'}
										color={'success'}
										sx={{ mr: 2 }}
										disabled={request?.isSale !== null}
										onClick={() => {
											changeRequest(true);
										}}
									>
										Completar venta
									</Button>
									<Button
										variant={'outlined'}
										color={'error'}
										disabled={request?.isSale !== null}
										onClick={() => {
											changeRequest(false);
										}}
									>
										Rechazar venta
									</Button>
								</Box>
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
										{request?.service ? ServiceType[request.service] : 'N/D'}
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
									<EditRequestDialog data={request} reloadRequest={refetch} />
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Fragment>
	);
};

RequestDetails.propTypes = {};

export default RequestDetails;
