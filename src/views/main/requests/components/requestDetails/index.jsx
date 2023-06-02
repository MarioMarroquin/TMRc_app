import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useLoading } from '../../../../../providers/loading';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REQUEST } from './requests';
import {
	Avatar,
	Box,
	Card,
	CardContent,
	CardHeader,
	Grid,
	Typography,
} from '@mui/material';
import { ServiceType } from '../../../../../utils/enums';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
			const aux = data.request;
			setRequest(aux);
		}
		setLoading(false);
	}, [data]);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Card>
					<CardHeader title='Detalles de Solicitud' />
					<CardContent>
						<Typography>Detalles</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography>Fecha</Typography>
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
								<Typography>Tipo de Servicio</Typography>
								<Typography>
									{request.service ? ServiceType[request.service] : 'N/D'}
								</Typography>
							</Grid>

							<Grid item xs={12}>
								<Typography>Medio de Contacto</Typography>
								<Typography>{request.contactMedium}</Typography>
							</Grid>

							<Grid item xs={12}>
								<Typography>Medio de Publicidad</Typography>
								<Typography>{request.advertisingMedium}</Typography>
							</Grid>

							<Grid item xs={12} sm={8} md={5}></Grid>

							<Grid item xs={12} sm={4} md={3}></Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

RequestDetails.propTypes = {};

export default RequestDetails;
