import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import {
	Box,
	Button,
	Drawer,
	IconButton,
	Stack,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import { useLoading } from '@providers/loading';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { Edit } from '@mui/icons-material';
import { UPDATE_OPERATOR_COMMENT_REQUEST } from '@views/main/requests/mutationRequests';
import { pxToRem } from '@config/theme/functions';

const InitialInfo = {
	requestId: undefined,
	operatorComments: '',
};

const RequestOperatorCommentDialog = ({ data, reloadRequest }) => {
	const theme = useTheme();
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

			<Drawer
				anchor={'right'}
				open={isVisible}
				// open={true}
				onClose={toggleDialog}
				sx={{
					'& .MuiDrawer-paper': {
						width: 350,
						height: 280,
						// height: `calc(100vh - 32px)`,
						top: pxToRem(64),
						borderRadius: pxToRem(16),
						marginRight: pxToRem(22),
						border: 'none',
						whiteSpace: 'nowrap',
						boxSizing: 'border-box',
						backdropFilter: `saturate(200%) blur(1.875rem)`,
						boxShadow: `0px 1px 2px rgba(3, 7, 18, 0.05),
												1px 3px 9px rgba(3, 7, 18, 0.10),
												3px 8px 20px rgba(3, 7, 18, 0.15),
												4px 13px 36px rgba(3, 7, 18, 0.20),
												7px 21px 56px rgba(3, 7, 18, 0.25),
												10px 30px 80px rgba(3, 7, 18, 0.30);`,
					},
				}}
				slotProps={{
					backdrop: {
						sx: {
							bgcolor: `${theme.palette.background.default}90`,
							backdropFilter: `blur(${pxToRem(8)})`,
						},
					},
				}}
			>
				<Box
					sx={{
						p: pxToRem(16),
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Typography variant={'primaryNormal16'} mb={pxToRem(24)}>
						Editar comentario
					</Typography>

					<TextField
						autoFocus
						fullWidth
						multiline
						maxRows={4}
						id={'operatorComments'}
						name={'operatorComments'}
						label={'Comentarios'}
						value={info.operatorComments}
						onChange={handleInputChange}
					/>

					<Stack mt={'auto'} flexDirection={'row'} justifyContent={'flex-end'}>
						<Button
							onClick={toggleDialog}
							variant={'outlined'}
							sx={{ mr: pxToRem(8) }}
						>
							Salir
						</Button>
						<Button disabled={!info.operatorComments} onClick={onFinish}>
							Guardar
						</Button>
					</Stack>
				</Box>
			</Drawer>
		</Fragment>
	);
};

RequestOperatorCommentDialog.propTypes = {
	data: PropTypes.object,
};

export default RequestOperatorCommentDialog;