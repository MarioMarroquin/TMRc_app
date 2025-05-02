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
		deleteReminder,
		completeReminder,
	} = useReminders();

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
	const handleDrop = (e, targetColumnId) => {
		e.preventDefault();
		const reminderId = e.dataTransfer.getData('reminderId');
		if (reminderId) {
			moveReminder(reminderId, targetColumnId);
		}
	};

	const handleDragStart = (e, reminderId) => {
		e.dataTransfer.setData('reminderId', reminderId);
		e.target.style.transform = 'scale(1.02)';
		e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
	};

	const handleDragEnd = (e) => {
		e.target.style.opacity = ''; // Restaurar la opacidad después del drag
		e.target.style.transform = '';
		e.target.style.boxShadow = '';
	};

	return (
		<>
			<Box display='flex' justifyContent='flex-start' p={1}>
				<Tooltip title='Agregar nuevo recordatorio'>
					<IconButton
						size='small'
						onClick={() => handleOpenModal('HOY')}
						sx={{
							backgroundColor: 'black',
							color: 'white',
							p: 7,
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
				gap={3} // Espacio mayor entre las columnas
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
							xs={6}
							sm={12}
							md={4}
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
									height: 'calc(88vh - 64px)',
									overflow: 'hidden',
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
										flex: 1,
										overflowY: 'auto',
										padding: 12,
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
										<Stack spacing={20}>
											{sortRemindersByDate(columns[columnId]).map(
												(reminder) => (
													<Fade in timeout={300} key={reminder.id}>
														<Card
															sx={{
																mb: 3,
																cursor: 'grab',
																boxShadow: 2,
																borderRadius: 2,
																bgcolor: 'white',
																p: 2,
																position: 'relative',
																transition:
																	'transform 0.35s ease-in-out, box-shadow 0.50s ease',
																'&:hover': {
																	transform: 'scale(1.03) translateY(-1px)',
																	boxShadow: 8,
																	zIndex: 3,
																},
															}}
															draggable
															onDragStart={(e) =>
																handleDragStart(e, reminder.id)
															}
															onDragEnd={handleDragEnd}
														>
															<Tooltip title='Eliminar'>
																<IconButton
																	size='small'
																	color='error'
																	onClick={() => {
																		if (
																			confirm(
																				'¿Quieres que este elemento se elimine por completo?'
																			)
																		) {
																			deleteReminder(reminder.id, columnId);
																			console.log(
																				'kanban eliminado',
																				reminder.id
																			);
																		}
																	}}
																	sx={{
																		position: 'absolute',
																		top: 0,
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
															<Typography
																variant='caption'
																color='textSecondary'
															>
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
																		onClick={() => {
																			if (
																				confirm(
																					'¿Marcar este recordatorio como completado?'
																				)
																			) {
																				ListoClick(
																					reminder,
																					reminder.description
																				);
																				console.log(
																					'✅ Kanban completado:',
																					reminder
																				);
																			}
																		}}
																	>
																		<CheckIcon fontSize='small' />
																	</IconButton>
																</Tooltip>
															</Stack>
														</Card>
													</Fade>
												)
											)}
										</Stack>
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
