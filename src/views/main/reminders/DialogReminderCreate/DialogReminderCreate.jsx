import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	TextField,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { NotificationAdd } from '@mui/icons-material';
import CustomDate from '@components/customDate';
import useReminderCreate from '@views/main/reminders/DialogReminderCreate/useReminderCreate';
import { LoadingButton } from '@mui/lab';

const DialogReminderCreate = (props) => {
	const theme = useTheme();
	const useReminder = useReminderCreate();

	return (
		<Fragment>
			<Button startIcon={<NotificationAdd />} disabled={true}>
				{useMediaQuery(theme.breakpoints.down('sm'))
					? 'Recordatorio'
					: 'Agregar recordatorio'}
			</Button>

			<Dialog open={false} maxWidth={'md'} fullWidth>
				<DialogTitle>Agregar a recordatorio</DialogTitle>
				<DialogContent>
					<DialogContentText fontSize={12} fontWeight={500}>
						Escribe una nota como recordatorio y selecciona la fecha a recordar.
					</DialogContentText>

					<Grid container spacing={8}>
						<Grid item xs={7}>
							<TextField
								multiline
								rows={10}
								autoFocus
								sx={{ mt: 10 }}
								id={'message'}
								name={'Nota'}
								placeholder={'Escribe...'}
								value={null}
								onChange={null}
							/>
						</Grid>
						<Grid item xs={5}>
							<Box
								sx={{
									display: 'flex',
								}}
							>
								<CustomDate
									extended
									date={useReminder.reminder.notificationDate}
									onChange={(item) => useReminder.handleDateChange(item)}
								/>
							</Box>
						</Grid>
					</Grid>
				</DialogContent>

				<DialogActions>
					<LoadingButton>regresar</LoadingButton>
					<LoadingButton
						loading={false}
						onClick={() => {}}
						variant={'contained'}
					>
						Subir
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

DialogReminderCreate.propTypes = {};

export default DialogReminderCreate;
