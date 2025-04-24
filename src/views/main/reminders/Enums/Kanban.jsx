import { useState } from 'react';
import {
	useReminders,
	sortRemindersByDate,
} from '@views/main/reminders/useReminders';
import { CreateReminderModal } from '@views/main/reminders/Enums/CreateReminderModal.jsx';
import {
	Box,
	Chip,
	IconButton,
	Tooltip,
	Typography,
	Stack,
	Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';

const COLUMN_LABELS = {
	VENCIDO: 'VENCIDO',
	HOY: 'HOY',
	'POR VENCER': 'POR VENCER',
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
		handleDeleteClick,
		handleCardClick,
		ListoClick,
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
			<Box display='flex' justifyContent='flex-end' p={1}>
				<Tooltip title='Agregar nuevo recordatorio'>
					<IconButton
						size='small'
						onClick={() => handleOpenModal('HOY')}
						sx={{
							bgcolor: '#f5f5f5',
							border: '1px solid #ccc',
							borderRadius: '50%',
							boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
							width: 32,
							height: 32,
						}}
					>
						<AddIcon fontSize='small' />
					</IconButton>
				</Tooltip>
			</Box>

			<Box display='flex' overflow='auto' gap={90} px={30}>
				{Object.keys(columns).map((columnId) => (
					<Box
						key={columnId}
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => handleDrop(e, columnId)}
						sx={{
							minWidth: 300,
							flexShrink: 0,
							bgcolor: '#fafafa',
							border: '1px solid #ddd',
							borderRadius: 2,
							p: 10,
							boxShadow:
								draggingColumnId === columnId
									? '0 0 0 2px #1976d2 inset'
									: '0 1px 3px rgba(0,0,0,0.1)',
						}}
					>
						<Box
							position='relative'
							display='flex'
							justifyContent='center'
							alignItems='center'
							mb={5}
						>
							<Typography variant='h5' fontWeight='bold'>
								{COLUMN_LABELS[columnId]}
							</Typography>
							<Tooltip title='Agregar recordatorio'>
								<IconButton
									size='small'
									onClick={() => handleOpenModal(columnId)}
									sx={{ position: 'absolute', right: 0 }}
								>
									<AddIcon fontSize='small' />
								</IconButton>
							</Tooltip>
						</Box>

						{columns[columnId].length === 0 ? (
							<Typography
								display='flex'
								justifyContent='center'
								variant='body2'
								color='textSecondary'
							>
								Arrastra o agrega un recordatorio aquí
							</Typography>
						) : (
							sortRemindersByDate(columns[columnId]).map((reminder) => (
								<Box
									key={reminder.id}
									draggable
									onDragStart={(e) => handleDragStart(e, reminder.id)}
									onDragEnd={handleDragEnd}
									sx={{
										position: 'relative',
										bgcolor: 'white',
										p: 15,
										borderRadius: 2,
										boxShadow: 1,
										mb: 30,
										cursor: 'grab',
									}}
								>
									<Tooltip title='Estatus'>
										<IconButton
											size='small'
											onClick={() => handleDeleteClick(reminder)}
											sx={{
												position: 'absolute',
												top: 4,
												right: 32,
											}}
										>
											<NotificationsIcon fontSize='small' />
										</IconButton>
									</Tooltip>

									{/* Botón de eliminar (tacha) arriba a la derecha */}
									<Tooltip title='Eliminar'>
										<IconButton
											size='small'
											color='error'
											onClick={() => handleDeleteClick(reminder)}
											sx={{
												position: 'absolute',
												top: 4,
												right: 4,
											}}
										>
											<CloseIcon fontSize='small' />
										</IconButton>
									</Tooltip>

									<Stack direction='row' spacing={1} mb={1}>
										<Chip label='LEAD' size='small' />
										<Chip
											label={reminder.title || 'Personal'}
											color={
												reminder.title?.toLowerCase() === 'renta'
													? 'error'
													: 'primary'
											}
											size='small'
										/>
									</Stack>
									<Typography>Hola</Typography>
									<Divider />
									<Stack direction='row' alignItems='center' mt={1}>
										<Typography variant='caption'>
											📅 {reminder.description}
										</Typography>
									</Stack>

									<Stack
										direction='row'
										spacing={1}
										sx={{
											position: 'absolute',
											bottom: 4,
											right: 4,
										}}
									>
										<Tooltip title='Editar recordatorio'>
											<IconButton
												size='small'
												color='primary'
												onClick={() => handleCardClick(reminder)}
											>
												<EditIcon fontSize='small' />
											</IconButton>
										</Tooltip>
										<Tooltip title='Hecho'>
											<IconButton
												size='small'
												color='success'
												onClick={() => ListoClick(reminder)}
											>
												<CheckIcon fontSize='small' />
											</IconButton>
										</Tooltip>
									</Stack>
								</Box>
							))
						)}
					</Box>
				))}
			</Box>

			<CreateReminderModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onSave={handleSaveReminder}
			/>
		</>
	);
};

export default Kanban;
