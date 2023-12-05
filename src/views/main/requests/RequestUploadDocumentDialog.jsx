import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Drawer,
	IconButton,
	Stack,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import { createRef, Fragment, useState } from 'react';
import { useLoading } from '@providers/loading';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseStorage } from '@config/firebase';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import {
	SAVE_DOCUMENT,
	UPDATE_DOCUMENT,
} from '@views/main/requests/mutationRequests';
import PropTypes from 'prop-types';
import { pxToRem } from '@config/theme/functions';

const RequestUploadDocumentDialog = ({ requestId, reloadRequest }) => {
	const { setLoading, loading } = useLoading();
	const [title, setTitle] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const toggleDialog = () => {
		setIsVisible((prev) => !prev);
		cleanStates();
	};
	const [saveDocument] = useMutation(SAVE_DOCUMENT);
	const [updateDocument] = useMutation(UPDATE_DOCUMENT);
	const theme = useTheme();

	const inputFileRef = createRef(null);
	const [docFile, setDocFile] = useState(null);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setTitle(value);
	};

	const handleOnChange = (event) => {
		const doc = event.target?.files?.[0];

		if (doc) {
			setDocFile(doc);
		}
	};

	const handleClick = (event) => {
		if (docFile) {
			event.preventDefault();
			inputFileRef.current.value = null;
			setDocFile(null);
		}
	};

	const cleanStates = () => {
		setTitle('');
		setDocFile(null);
	};

	const onFinish = async () => {
		setLoading(true);
		// const toastId = toast.loading('Cargando...');

		const doc = await saveDocument({
			variables: {
				document: { title },
			},
		});

		try {
			if (!doc.errors) {
				const savedDoc = doc.data.saveDocument;
				console.log('no hay errores', savedDoc);
				const path = `documents/${savedDoc.id}-${title}`;
				const storageRef = ref(firebaseStorage, path);

				const uploadTask = uploadBytesResumable(storageRef, docFile);

				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						);

						console.log('upload', progress);
					},
					(error) => {
						alert(error);
						// toast.error('Ocurrio un error', { id: toastId });
						toast.error('Ocurrio un error', error);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							console.log('URL', downloadURL);

							updateDocument({
								variables: {
									documentId: savedDoc.id,
									document: { fileURL: downloadURL, path, requestId },
								},
							}).then((response) => {
								cleanStates();
								setLoading(false);
								toast.success('Documento cargado');
								reloadRequest();
								toggleDialog();
							});
						});
					}
				);
			} else {
				toast.error('Ocurrio un error');
				console.log('hay errores');
				setLoading(false);
			}
		} catch (e) {
			console.log('Error doc upload', e);
		}
	};

	return (
		<Fragment>
			<Button
				variant={'contained'}
				startIcon={<Upload />}
				onClick={toggleDialog}
			>
				Cargar
			</Button>

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
						Sube tu archivo PDF
					</Typography>

					<TextField
						autoFocus
						margin={'none'}
						fullWidth
						id={'title'}
						name={'title'}
						label={'Nombre de archivo'}
						value={title}
						onChange={handleInputChange}
					/>

					<input
						ref={inputFileRef}
						//accept='.png, .jpg, .jpeg'
						hidden
						id='doc-upload'
						type='file'
						onChange={handleOnChange}
					/>
					<label htmlFor='doc-upload'>
						<Box
							mt={3}
							display={'flex'}
							flexDirection='column'
							justifyContent={'space-between'}
							alignItems='center'
						>
							<Typography variant='caption' display='block' gutterBottom>
								{!docFile ? 'Selecciona un archivo' : docFile.name}
							</Typography>
							<IconButton
								component='span'
								onClick={handleClick}
								color='primary'
							>
								<Upload />
							</IconButton>
						</Box>
					</label>

					<Stack mt={'auto'} flexDirection={'row'} justifyContent={'flex-end'}>
						<Button
							sx={{ mr: pxToRem(8) }}
							disabled={loading}
							onClick={toggleDialog}
							variant={'text'}
						>
							Cancelar
						</Button>
						<Button
							disabled={!(title && docFile) || loading}
							onClick={onFinish}
						>
							Guardar
						</Button>
					</Stack>
				</Box>
			</Drawer>
		</Fragment>
	);
};

RequestUploadDocumentDialog.propTypes = {
	requestId: PropTypes.number.isRequired,
	reloadRequest: PropTypes.func.isRequired,
};

export default RequestUploadDocumentDialog;
