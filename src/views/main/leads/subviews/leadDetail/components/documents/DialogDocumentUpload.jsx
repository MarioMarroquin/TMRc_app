import PropTypes from 'prop-types';
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	TextField,
	Typography,
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import { Fragment } from 'react';
import { LoadingButton } from '@mui/lab';
import ProgressLoader from '@components/progressLoader';

const DialogDocumentUpload = ({
	onClose,
	open,
	leadId,
	refetch,
	value,
	onChange,
	documentRef,
	onChangeInput,
	documentFile,
	inputClick,
	onCreate,
	uploadProgress,
	loading,
}) => {
	return (
		<Fragment>
			<Dialog fullWidth open={open} maxWidth={'xs'} onClose={onClose}>
				<DialogTitle>Cargar documento</DialogTitle>
				<DialogContent>
					<DialogContentText fontSize={12} fontWeight={500}>
						Carga tu documento PDF, por ejemplo tu cotización.
					</DialogContentText>

					<TextField
						autoFocus
						sx={{ mt: 10 }}
						id={'title'}
						name={'title'}
						placeholder={'Título de archivo'}
						value={value}
						onChange={onChange}
					/>

					{Boolean(loading) && uploadProgress ? (
						<Box
							sx={{
								mt: 24,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<ProgressLoader progress={uploadProgress} />
						</Box>
					) : (
						<Fragment>
							<input
								ref={documentRef}
								accept='.png, .jpg, .jpeg, .pdf, .pptx, .ppt'
								hidden
								id='doc-upload'
								type='file'
								onChange={onChangeInput}
							/>
							<label htmlFor='doc-upload'>
								<Box
									sx={{
										mt: 24,
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Typography variant='caption' display='block' gutterBottom>
										{!documentFile
											? 'Selecciona un archivo'
											: documentFile.name}
									</Typography>
									<IconButton
										component='span'
										onClick={inputClick}
										color='primary'
									>
										<Upload />
									</IconButton>
								</Box>
							</label>
						</Fragment>
					)}
				</DialogContent>
				<DialogActions>
					<LoadingButton disabled={Boolean(loading)} onClick={onClose}>
						regresar
					</LoadingButton>
					<LoadingButton
						disabled={!(value && documentFile)}
						loading={Boolean(loading)}
						onClick={() => {
							onCreate(onClose, leadId, refetch);
						}}
						variant={'contained'}
					>
						Subir
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

DialogDocumentUpload.propTypes = {
	documentFile: PropTypes.element,
	inputClick: PropTypes.func.isRequired,
	leadId: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	onChangeInput: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	documentRef: PropTypes.instanceOf(HTMLInputElement),
	refetch: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
	onCreate: PropTypes.func.isRequired,
	uploadProgress: PropTypes.number,
	loading: PropTypes.number,
};

export default DialogDocumentUpload;
