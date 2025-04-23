import { useState } from 'react';
import {
	useReminders,
	sortRemindersByDate,
} from '@views/main/reminders/useReminders.js'; // Asegúrate de importar la función
import '@views/main/reminders/Enums/Kanban.css';
import AddIcon from '@mui/icons-material/Add';
import {
	IconButton,
	Tooltip,
	Chip,
	Stack,
	Divider,
	Typography,
	Button,
} from '@mui/material';
import { CreateReminderModal } from '@views/main/reminders/Enums/CreateReminderModal.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const COLUMN_LABELS = {
	VENCIDO: 'VENCIDO',
	HOY: 'HOY',
	'POR VENCER': 'POR VENCER',
};

export const handleClick = () => {
	console.info('You clicked the Chip.');
};

const Kanban = () => {
	const {
		columns,
		moveReminder,
		onDragEnd,
		handleDragEnd,
		handleDragStart,
		handleDrop,
		draggingColumnId,
		addReminderToColumn,
	} = useReminders();

	const [modalOpen, setModalOpen] = useState(false);
	const [activeColumn, setActiveColumn] = useState(null);

	const handleOpenModal = (columnId) => {
		setActiveColumn(columnId);
		setModalOpen(true);
	};

	const handleSaveReminder = (newReminder) => {
		if (activeColumn) {
			addReminderToColumn(activeColumn, newReminder);
		}
	};

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					paddingLeft: '16px',
					marginBottom: '8px',
				}}
			>
				<Tooltip title='Agregar nuevo recordatorio'>
					<IconButton
						size='small'
						onClick={() => handleOpenModal('HOY')}
						style={{
							backgroundColor: '#f5f5f5',
							border: '1px solid #ccc',
							borderRadius: '50%',
							boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
							width: '32px',
							height: '32px',
						}}
					>
						<AddIcon fontSize='small' />
					</IconButton>
				</Tooltip>
			</div>
			<div className='kanban-container'>
				{Object.keys(columns).map((columnId) => (
					<div
						key={columnId}
						className={`kanban-column ${
							draggingColumnId === columnId ? 'dragging-over' : ''
						}`}
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => handleDrop(e, columnId)}
					>
						<div className='kanban-column-title'>
							{COLUMN_LABELS[columnId] ? COLUMN_LABELS[columnId] : columnId}{' '}
							<Tooltip title='Agregar recordatorio a esta columna'>
								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									<IconButton
										size='small'
										onClick={() => handleOpenModal(columnId)}
										style={{
											display: 'flex',
											justifyContent: 'flex-end',
											backgroundColor: '#e0e0e0',
											boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
										}}
									>
										<AddIcon fontSize='small' />
									</IconButton>
								</div>
							</Tooltip>
						</div>

						{/* Verifica si no hay recordatorios en la columna */}
						{columns[columnId].length === 0 ? (
							<div className='empty-column-message'>
								Arrastra o agrega un recordatorio aquí
							</div>
						) : (
							sortRemindersByDate(columns[columnId]).map((reminder) => (
								<div
									key={reminder.id}
									className='kanban-card'
									draggable
									onDragStart={(e) => handleDragStart(e, reminder.id)}
									onDragEnd={handleDragEnd}
								>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: '6px',
											marginBottom: '8px',
										}}
									>
										<Stack direction='row'>
											<Chip
												label={reminder.id}
												onClick={handleClick}
												size='small'
											/>
											<Chip
												label={reminder.title || 'Personal'}
												onClick={handleClick}
												color={
													reminder.title?.toLowerCase() === 'renta'
														? 'error'
														: 'primary'
												}
												size='small'
											/>
										</Stack>
										<Divider />
										<Stack
											direction='row'
											spacing={1}
											alignItems='center'
											justifyContent='space-between'
										>
											<Typography variant='caption'>{`📅 ${reminder.description}`}</Typography>
											<Stack direction='row' spacing={0.5}>
												<Button
													variant='outlined'
													size='small'
													color='error'
													startIcon={<DeleteIcon fontSize='small' />}
													sx={{ minHeight: 24, height: 24, px: 1, padding: 8 }}
												>
													Eliminar
												</Button>
												<Button
													variant='contained'
													size='small'
													color='success'
													startIcon={<CheckIcon fontSize='small' />}
													sx={{ minHeight: 24, height: 24, px: 1, padding: 8 }}
												>
													Listo
												</Button>
											</Stack>
										</Stack>
									</div>
								</div>
							))
						)}
					</div>
				))}
			</div>
			<CreateReminderModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onSave={handleSaveReminder}
			/>
		</>
	);
};

export default Kanban;
