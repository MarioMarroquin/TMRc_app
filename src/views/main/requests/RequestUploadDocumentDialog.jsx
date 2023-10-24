import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	Typography,
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

const RequestUploadDocumentDialog = ({ requestId, reloadRequest }) => {
	const { setLoading, loading } = useLoading();
	const [title, setTitle] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const toggleDialog = () => setIsVisible((prev) => !prev);
	const [saveDocument] = useMutation(SAVE_DOCUMENT);
	const [updateDocument] = useMutation(UPDATE_DOCUMENT);

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

	const onFinish = async () => {
		setLoading(true);
		const toastId = toast.loading('Cargando...');

		const doc = await saveDocument({
			variables: {
				document: { title },
			},
		});

		if (!doc.errors) {
			const savedDoc = doc.data.saveDocument;
			console.log('no hay errores');
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
					toast.error('Ocurrio un error', { id: toastId });
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
							setTitle('');
							setDocFile(null);
							toast.success('Documento cargado', { id: toastId });
							reloadRequest();
							toggleDialog();
						});
					});
				}
			);
		} else {
			toast.error('Ocurrio un error', { id: toastId });
			console.log('hay errores');
		}

		setLoading(false);
	};

	return (
		<Fragment>
			<IconButton onClick={toggleDialog}>
				<Upload />
			</IconButton>

			<Dialog open={isVisible} onClose={toggleDialog} fullWidth maxWidth={'sm'}>
				<DialogTitle>Subir archivo</DialogTitle>
				<DialogContent>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<TextField
							autoFocus
							fullWidth
							margin={'none'}
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
								flexDirection='row'
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
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={loading}
						onClick={toggleDialog}
						variant={'outlined'}
					>
						Salir
					</Button>
					<Button disabled={!title || loading} onClick={onFinish}>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

RequestUploadDocumentDialog.propTypes = {};

export default RequestUploadDocumentDialog;
