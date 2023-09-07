import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	TextField,
	Typography,
} from '@mui/material';
import { useLoading } from '@providers/loading';
import { useMutation } from '@apollo/client';
import { UPDATE_OBSERVATION } from './requests';
import toast from 'react-hot-toast';

const InitialRequest = {
	id: '',
	extraComments: '',
};

const EditRequestDialog = ({ data, reloadRequest }) => {
	const { setLoading } = useLoading();
	const [request, setRequest] = useState(InitialRequest);
	const [isVisible, setIsVisible] = useState(false);
	const toggleDialog = () => setIsVisible((prev) => !prev);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setRequest({ ...request, [name]: value });
	};

	const [updateRequest] = useMutation(UPDATE_OBSERVATION);

	const onFinish = (e) => {
		e.preventDefault();

		setLoading(true);

		const variables = {
			requestId: request.id,
			text: request.extraComments,
		};

		updateRequest({
			variables,
		})
			.then((res) => {
				if (!res.errors) {
					toast.success('Guardado');
					reloadRequest();
					toggleDialog();
				} else {
					console.log('Errores', res.errors);
					toast.error('Error al guardar');
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log('Error', err);
				setLoading(false);
			});
	};

	useEffect(() => {
		if (data) {
			const { id, extraComments } = data;

			setRequest({ id, extraComments });
		}
	}, [data, isVisible]);

	return (
		<Fragment>
			<Button variant={'text'} sx={{ mt: 2 }} onClick={toggleDialog}>
				Cambiar observación
			</Button>

			<Dialog open={isVisible} onClose={toggleDialog} maxWidth={'md'}>
				<DialogTitle>Editar observación</DialogTitle>
				<DialogContent>
					<Grid container>
						<Grid item xs={12}>
							<Typography variant={'caption'} color={'text.primaryLight'}>
								Observaciones:
							</Typography>
							<TextField
								fullWidth
								multiline
								margin={'none'}
								maxRows={4}
								id={'extraComments'}
								name={'extraComments'}
								value={request.extraComments}
								onChange={handleInputChange}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={toggleDialog} variant={'outlined'}>
						Salir
					</Button>
					<Button disabled={!request.extraComments} onClick={onFinish}>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

EditRequestDialog.propTypes = {
	data: PropTypes.object,
};

export default EditRequestDialog;
