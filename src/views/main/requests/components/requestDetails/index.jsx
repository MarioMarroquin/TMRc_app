import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useLoading } from '../../../../../providers/loading';
import { Fragment, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REQUEST } from './requests';
import {
	Avatar,
	Box,
	Card,
	CardContent,
	CardHeader,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
import {
	ProductStatus,
	RequestStatus,
	ServiceType,
} from '../../../../../utils/enums';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { pxToRem } from '../../../../../config/theme/functions';
import EditRequestDialog from '../editRequestDialog';

const RequestDetails = (props) => {
	const { id } = useParams();
	const { setLoading } = useLoading();
	const [request, setRequest] = useState();

	const { data, loading } = useQuery(GET_REQUEST, {
		variables: { requestId: id },
	});

	useEffect(() => {
		setLoading(true);
		if (data) {
			const { __typename, ...aux } = data.request;
			console.log(aux);
			setRequest(aux);
		}
		setLoading(false);
	}, [data]);

	return (
		<Fragment>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Card>
						<CardHeader title='Detalles de Solicitud' />
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'flex-end',
									width: '100%',
									flexWrap: 'wrap',
								}}
							>
								<Stack mr={pxToRem(15)}>
									<Typography fontWeight={700} fontSize={pxToRem(14)}>
										Estatus
									</Typography>
									<Typography>
										{request?.status ? RequestStatus[request?.status] : 'N/D'}
									</Typography>
								</Stack>
								<Stack mr={pxToRem(15)}>
									<Typography fontWeight={700} fontSize={pxToRem(14)}>
										Venta
									</Typography>
									<Typography>
										{request?.sale
											? 'Si'
											: request?.sale === false
											? 'No'
											: 'N/D'}
									</Typography>
								</Stack>
								<EditRequestDialog data={request} />
							</Box>
							<Box>
								<Stack>
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
									<Typography>
										{request?.service ? ServiceType[request.service] : 'N/D'}
									</Typography>
								</Stack>
							</Box>
							<Grid container spacing={2} sx={{ m: 0 }}>
								<Grid item container xs={6}>
									<Grid item xs={12}>
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
									</Grid>

									<Grid item xs={12}>
										<Typography fontWeight={700} fontSize={pxToRem(14)}>
											Tipo de Servicio
										</Typography>
										<Typography>
											{request?.service ? ServiceType[request.service] : 'N/D'}
										</Typography>
									</Grid>

									<Grid item xs={12}>
										<Typography fontWeight={700} fontSize={pxToRem(14)}>
											Medio de Contacto
										</Typography>
										<Typography>{request?.contactMedium}</Typography>
									</Grid>

									<Grid item xs={12}>
										<Typography fontWeight={700} fontSize={pxToRem(14)}>
											Medio de Publicidad
										</Typography>
										<Typography>{request?.advertisingMedium}</Typography>
									</Grid>

									<Grid item xs={12} sm={8} md={5}>
										<Typography fontWeight={700} fontSize={pxToRem(14)}>
											Asesor
										</Typography>
										<Typography>
											{request?.user.firstName} {request?.user.lastName}
										</Typography>
									</Grid>

									<Grid item xs={12} sm={4} md={3}>
										<Typography fontWeight={700} fontSize={pxToRem(14)}>
											Marca
										</Typography>
										<Typography>{request?.brand.name}</Typography>
									</Grid>
								</Grid>

								<Grid item container xs={6}>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<Typography fontWeight={700} fontSize={pxToRem(14)}>
												{' '}
												Estatus de producto
											</Typography>
											<Typography>
												{request?.productStatus
													? ProductStatus[request?.productStatus]
													: 'N/D'}
											</Typography>
										</Grid>

										<Grid item xs={12}>
											<Typography fontWeight={700} fontSize={pxToRem(14)}>
												Comentarios
											</Typography>
											<Typography>{request?.comments}</Typography>
										</Grid>

										<Grid item xs={12}>
											<Typography fontWeight={700} fontSize={pxToRem(14)}>
												Empresa
											</Typography>
											<Typography>{request?.company.name}</Typography>
										</Grid>

										<Grid item xs={12}>
											<Typography fontWeight={700} fontSize={pxToRem(14)}>
												Cliente
											</Typography>
											<Typography>
												{request?.client?.firstName}{' '}
												{request?.client?.firstLastName}
											</Typography>
										</Grid>

										<Grid item xs={12} sm={8} md={5}>
											<Typography fontWeight={700} fontSize={pxToRem(14)}>
												Observaciones
											</Typography>
											<Typography>{request?.extraComments}</Typography>
										</Grid>

										<Grid item xs={12} sm={4} md={3}>
											<Typography fontWeight={700} fontSize={pxToRem(14)}>
												Estatus
											</Typography>
											<Typography>
												{request?.status
													? RequestStatus[request?.status]
													: 'N/D'}
											</Typography>
										</Grid>
									</Grid>
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
