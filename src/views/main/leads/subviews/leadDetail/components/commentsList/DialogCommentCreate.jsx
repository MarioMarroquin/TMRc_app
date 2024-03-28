import PropTypes from 'prop-types';
import {
	backdropClasses,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from '@mui/material';
import { useSession } from '@providers/session';
import { LoadingButton } from '@mui/lab';
import { ROLES } from '@config/permisissions/permissions';

const DialogCommentCreate = ({
	assignedUserId,
	loading,
	onChange,
	onCreate,
	onExit,
	open,
	refetchRequest,
	role,
	userId,
	value,
}) => {
	return (
		<Dialog fullWidth open={open} maxWidth={'sm'} onClose={onExit}>
			<DialogTitle>Agregar comentario</DialogTitle>
			<DialogContent>
				<DialogContentText fontSize={12} fontWeight={500}>
					{ROLES.salesManager === role
						? assignedUserId === userId
							? 'Agrega tu comentario de seguimiento.'
							: 'Agrega un comentario al vendedor. Sera notificado via mensaje. '
						: 'Agrega tu comentario de seguimiento, mismo que sera visto por gerentes.'}
				</DialogContentText>
				<TextField
					autoFocus
					rows={2}
					multiline
					sx={{ mt: 10 }}
					id={'comment'}
					name={'comment'}
					value={value}
					onChange={onChange}
				/>
			</DialogContent>
			<DialogActions>
				<LoadingButton disabled={Boolean(loading)} onClick={onExit}>
					regresar
				</LoadingButton>
				<LoadingButton
					disabled={!value}
					loading={Boolean(loading)}
					onClick={() => {
						onCreate(refetchRequest);
					}}
					variant={'contained'}
				>
					Agregar
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

DialogCommentCreate.propTypes = {
	loading: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	onCreate: PropTypes.func.isRequired,
	onExit: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	refetchRequest: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
};

export default DialogCommentCreate;
