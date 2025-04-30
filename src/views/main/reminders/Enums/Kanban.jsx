import { useState, useRef } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Grid,
	IconButton,
	Tooltip,
	Typography,
	Stack,
	Divider,
	Fade,
	Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { CreateReminderModal } from '@views/main/reminders/Enums/CreateReminderModal.jsx';
import {
	useReminders,
	sortRemindersByDate,
} from '@views/main/reminders/useReminders';

const COLUMN_LABELS = {
	VENCIDO: 'VENCIDO',
	HOY: 'HOY',
	'POR VENCER': 'POR VENCER',
};

const Kanban = () => {
	const {
		columns,
		moveReminder,
		addReminderToColumn,
		handleCardClick,
		handleDeleteClick,
		ListoClick,
	} = useReminders();

	const [draggingId, setDraggingId] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [activeColumn, setActiveColumn] = useState(null);
	const kanbanContainerRef = useRef(null); // Referencia para el contenedor del Kanban

	const handleOpenModal = (columnId) => {
		setActiveColumn(columnId);
		setModalOpen(true);
	};

	const handleSaveReminder = (newReminder) => {
		if (activeColumn) {
			addReminderToColumn(activeColumn, newReminder);
			// Aseguramos que el scroll baje cuando se agrega un recordatorio
			if (kanbanContainerRef.current) {
				kanbanContainerRef.current.scrollTop =
					kanbanContainerRef.current.scrollHeight;
			}
		}
	};

	// Función para manejar el drop y mover la tarjeta
	const handleDragStart = (e, id, columnId) => {
		setDraggingId(id);
		e.dataTransfer.setData('id', id); // Save the dragged item data
		e.dataTransfer.setData('columnId', columnId); // Save the column of the dragged item
	};

	const handleDrop = (e, targetColumnId) => {
		e.preventDefault();
		const draggedId = e.dataTransfer.getData('id');
		const sourceColumnId = e.dataTransfer.getData('columnId');

		if (sourceColumnId !== targetColumnId) {
			// Add the card to the new column
			const draggedItem = columns[sourceColumnId].find(
				(item) => item.id === draggedId
			);
			addReminderToColumn(targetColumnId, draggedItem); // Moves the item to the new column
		}
	};

	const handleDragEnd = (e) => {
		e.target.style.opacity = ''; // Restaurar la opacidad después del drag
	};

	return (
		<>
			<Box display='flex' justifyContent='flex-end' p={1}>
				<Tooltip title='Agregar nuevo recordatorio'>
					<IconButton
						size='small'
						onClick={() => handleOpenModal('HOY')}
						sx={{
							backgroundColor: 'black',
							color: 'white',
							transition: 'transform 0.2s ease',
							'&:hover': {
								transform: 'scale(1.1)',
								backgroundColor: 'black', // mantiene el fondo negro
							},
						}}
					>
						<AddIcon fontSize='small' />
					</IconButton>
				</Tooltip>
			</Box>

			{/* Contenedor Kanban con scroll y mayor espacio entre columnas */}
			<Box
				display='flex'
				gap={8} // Espacio mayor entre las columnas
				ref={kanbanContainerRef}
				sx={{
					maxHeight: '80vh',
					overflowY: 'auto',
					p: 2,
				}}
			>
				<Grid container spacing={40}>
					{/* Espacio entre los grids */}
					{Object.keys(columns).map((columnId) => (
						<Grid
							key={columnId}
							item
							xs={12}
							sm={4}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'stretch',
								borderRadius: 2,
							}}
							onDrop={(e) => handleDrop(e, columnId)} // Maneja el drop en la columna
							onDragOver={(e) => e.preventDefault()} // Necesario para permitir el drop
						>
							<Card
								sx={{
									bgcolor: '#f5f5f5',
									boxShadow: 3,
									mb: 3,
									display: 'flex',
									flexDirection: 'column',
									minHeight: 200,
								}}
							>
								<CardHeader
									title={COLUMN_LABELS[columnId]}
									action={
										<Tooltip title='Agregar recordatorio'>
											<IconButton
												size='small'
												onClick={() => handleOpenModal(columnId)}
												sx={{ color: 'white' }}
											>
												<AddIcon />
											</IconButton>
										</Tooltip>
									}
									sx={{
										bgcolor: '#000000',
										color: 'white',
										textAlign: 'center',
										borderRadius: '4px 4px 0 0',
									}}
								/>

								<CardContent
									sx={{
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'flex-start',
										gap: 15, // Aumentamos el espacio entre las tarjetas dentro de la columna
										overflowY: 'auto',
										paddingBottom: 3,
									}}
								>
									{columns[columnId].length === 0 ? (
										<Typography
											variant='body2'
											color='textSecondary'
											textAlign='center'
										>
											Arrastra o agrega un recordatorio aquí
										</Typography>
									) : (
										sortRemindersByDate(columns[columnId]).map((reminder) => (
											<Fade in timeout={300} key={reminder.id}>
												<Card
													sx={{
														mb: 3, // Espacio mayor entre las tarjetas
														cursor: 'grab',
														boxShadow: 2,
														borderRadius: 2,
														bgcolor: 'white',
														p: 2,
														position: 'relative',
														transition: 'all 0.3s ease',
													}}
													draggable
													onDragStart={(e) => handleDragStart(e, reminder.id)}
													onDragEnd={handleDragEnd}
												>
													<Tooltip title='Eliminar'>
														<IconButton
															size='small'
															color='error'
															onClick={handleDeleteClick}
															sx={{
																position: 'absolute',
																top: 1,
																right: 1,
																zIndex: 2,
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
													<Typography variant='body2'>
														{reminder.title}
													</Typography>
													<Divider sx={{ my: 10 }} />
													<Typography variant='caption' color='textSecondary'>
														📅 {reminder.description}
													</Typography>
													<Stack
														direction='row'
														spacing={1}
														sx={{
															position: 'absolute',
															bottom: 1,
															right: 1,
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
												</Card>
											</Fade>
										))
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
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
