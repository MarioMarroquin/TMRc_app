import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
} from '@mui/material';
import { useLoading } from '@providers/loading';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { Edit } from '@mui/icons-material';
import { UPDATE_OPERATOR_COMMENT_REQUEST } from '@views/main/requests/mutationRequests';

const InitialInfo = {
	requestId: undefined,
	operatorComments: '',
};

const RequestOperatorCommentDialog = ({ data, reloadRequest }) => {
	const { setLoading } = useLoading();
	const [info, setInfo] = useState(InitialInfo);
	const [isVisible, setIsVisible] = useState(false);
	const toggleDialog = () => setIsVisible((prev) => !prev);

	const [updateComment] = useMutation(UPDATE_OPERATOR_COMMENT_REQUEST);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setInfo({ ...info, [name]: value });
	};

	const onFinish = (e) => {
		e.preventDefault();

		setLoading(true);
		updateComment({
			variables: info,
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
			const { id, operatorComments } = data;

			setInfo({ requestId: id, operatorComments });
		}
	}, [data, isVisible]);

	return (
		<Fragment>
			<IconButton onClick={toggleDialog}>
				<Edit />
			</IconButton>

			<Dialog open={isVisible} onClose={toggleDialog} fullWidth maxWidth={'sm'}>
				<DialogTitle>Editar comentario</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						multiline
						margin={'none'}
						maxRows={4}
						id={'operatorComments'}
						name={'operatorComments'}
						label={'Comentarios'}
						value={info.operatorComments}
						onChange={handleInputChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={toggleDialog} variant={'outlined'}>
						Salir
					</Button>
					<Button disabled={!info.operatorComments} onClick={onFinish}>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

RequestOperatorCommentDialog.propTypes = {
	data: PropTypes.object,
};

export default RequestOperatorCommentDialog;
