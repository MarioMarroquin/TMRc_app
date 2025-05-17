import { useState, useRef, useEffect } from 'react';
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
import { QuickReminderModal } from '@views/main/reminders/Enums/QuickReminderModal.jsx';
import {
	useReminders,
	sortRemindersByDate,
} from '@views/main/reminders/useReminders';

const COLUMN_LABELS = {
	VENCIDO: 'VENCIDO',
	HOY: 'HOY',
	'POR VENCER': 'POR VENCER',
};

const Kanban = ({ handleMarkAsCompleted }) => {
	const {
		columns,
		moveReminder,
		addReminderToColumn,
		handleCardClick,
		handleDeleteClick,
		ListoClick,
		deleteReminder,
		completeReminder,
		handleSaveFromModal,
		restoreReminderToSource,
		handleCancelModal,
		itemToEdit,
		setColumns,
	} = useReminders();

	const [modalOpen, setModalOpen] = useState(false);
	const [activeColumn, setActiveColumn] = useState(null);
	const kanbanContainerRef = useRef(null); // Referencia para el contenedor del Kanban
	const [selectedReminder, setSelectedReminder] = useState(null);
	const [quickModalOpen, setQuickModalOpen] = useState(false);
	const [quickModalColumn, setQuickModalColumn] = useState(null);

	useEffect(() => {
		// Cargar estado del Kanban al montar
		const savedColumns = localStorage.getItem('kanbanColumns');
		if (savedColumns) {
			try {
				const parsed = JSON.parse(savedColumns);
				setColumns(parsed);
			} catch (error) {
				console.error('Error al cargar estado del Kanban:', error);
			}
		}
	}, []);

	// Nuevo efecto para persistir cambios
	useEffect(() => {
		if (Object.keys(columns).length > 0) {
			localStorage.setItem('kanbanColumns', JSON.stringify(columns));
		}
	}, [columns]);

	const handleOpenModal = (columnId, reminder) => {
		setActiveColumn(columnId);
		if (reminder) {
			// Extraer la fecha y hora de la descripción
			const [date, time] = reminder.description?.split(' - ') || ['', ''];
			setSelectedReminder({
				...reminder,
				columnId,
				date,
				time, // Aseguramos que la hora se incluya
			});
		} else {
			setSelectedReminder(null);
		}
		setModalOpen(true);
	};

	const handleOpenQuickModal = (columnId) => {
		setQuickModalColumn(columnId);
		setQuickModalOpen(true);
	};

	const handleCloseQuickModal = () => {
		setQuickModalOpen(false);
		setQuickModalColumn(null);
	};

	const handleSaveQuickReminder = (columnId, newReminder) => {
		addReminderToColumn(columnId, newReminder);
		handleCloseQuickModal();
	};

	// const handleSaveReminder = (newReminder) => {
	// 	// Si es un nuevo recordatorio, asignamos 'personal' por defecto
	// 	const reminderWithType = {
	// 		...newReminder,
	// 		type: newReminder.type || 'personal', // Si no tiene tipo, asignamos 'personal'
	// 	};
	// 	if (activeColumn) {
	// 		addReminderToColumn(activeColumn, reminderWithType);
	// 		// Aseguramos que el scroll baje cuando se agrega un recordatorio
	// 		if (kanbanContainerRef.current) {
	// 			kanbanContainerRef.current.scrollTop =
	// 				kanbanContainerRef.current.scrollHeight;
	// 		}
	// 	}
	// };

	const handleDrop = (e, targetColumnId) => {
		e.preventDefault();
		const reminderId = e.dataTransfer.getData('reminderId');

		if (reminderId) {
			console.log('Iniciando drop de:', reminderId, 'a:', targetColumnId);

			// Encontrar el recordatorio en cualquier columna
			let movedItem;
			Object.keys(columns).forEach((columnId) => {
				const item = columns[columnId].find(
					(item) => item.id.toString() === reminderId
				);
				if (item) {
					movedItem = item;
				}
			});

			if (targetColumnId === 'POR VENCER' && movedItem) {
				const [date = '', time = ''] =
					movedItem.description?.split(' - ') || [];
				handleOpenModal(targetColumnId, {
					id: movedItem.id,
					title: movedItem.title,
					date,
					time,
					type: movedItem.type,
					description: movedItem.description,
				});
			} else {
				moveReminder(reminderId, targetColumnId);
				console.log('Movimiento completado:', reminderId, 'a', targetColumnId);
			}
		}
	};

	const handleSaveReminderFromModal = (newReminder) => {
		// Si el recordatorio fue movido a 'Por Vencer', lo guardamos en esa columna
		if (activeColumn === 'POR VENCER') {
			handleSaveFromModal(newReminder); // Se guarda en la columna 'POR VENCER'
		} else {
			// Si no está en 'Por Vencer', se guarda en su columna original sin mover
			handleSaveFromModal(newReminder); // Se guarda en la columna original
		}
		console.log('datos: ', newReminder);
		setModalOpen(false);
		setSelectedReminder(null);
		setActiveColumn('POR VENCER');
	};

	const handleDragStart = (e, reminderId, sourceColumnId) => {
		console.log('Iniciando drag:', { reminderId, sourceColumnId });
		e.dataTransfer.setData('reminderId', reminderId);
		e.dataTransfer.setData('sourceColumnId', sourceColumnId);
		e.target.style.transform = 'scale(1.02)';
		e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
	};

	const handleDragEnd = (e) => {
		e.target.style.opacity = ''; // Restaurar la opacidad después del drag
		e.target.style.transform = '';
		e.target.style.boxShadow = '';
	};

	const handleCloseModal = () => {
		handleCancelModal(); // Restaurar la card a su posición original
		setModalOpen(false);
		setSelectedReminder(null);
	};

	useEffect(() => {
		console.log('Render actual de columnas:', columns);
	}, [columns]);

	return (
		<>
			<Box display='flex' justifyContent='flex-start' p={1}>
				<Tooltip title='Agregar nuevo recordatorio'>
					<IconButton
						size='small'
						onClick={() => handleOpenModal('POR VENCER')} // Cambiar 'HOY' por 'POR VENCER'
						sx={{
							backgroundColor: 'black',
							color: 'white',
							p: 7,
							transition: 'transform 0.2s ease',
							'&:hover': {
								transform: 'scale(1.1)',
								backgroundColor: 'black',
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
							onDrop={(e) => handleDrop(e, columnId)}
							onDragOver={(e) => e.preventDefault()}
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
												onClick={() => handleOpenQuickModal(columnId)}
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
																handleDragStart(e, reminder.id, columnId)
															}
															onDragEnd={handleDragEnd}
															onDoubleClick={() =>
																handleOpenModal(columnId, reminder)
															}
														>
															<Tooltip
																title='Haz double click para editar o manten presionado para arrastrar'
																arrow
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
																	<Chip
																		label={
																			reminder.type === 'lead'
																				? 'LEAD'
																				: 'Personal'
																		}
																		color={
																			reminder.type === 'lead'
																				? 'secondary'
																				: 'primary'
																		}
																		size='small'
																		sx={{ fontWeight: 'bold' }}
																	/>
																</Stack>
																<Typography
																	variant='caption'
																	sx={{
																		display: 'block',
																		whiteSpace: 'nowrap',
																		overflow: 'hidden',
																		textOverflow: 'ellipsis',
																		maxWidth: '100%', // Asegura que el texto no se expanda
																	}}
																>
																	{reminder.title}
																</Typography>
																<Divider sx={{ my: 10 }} />
																<Typography
																	variant='caption'
																	color='textSecondary'
																>
																	📅 {reminder.description}
																</Typography>
																<Typography
																	variant='caption'
																	color='textSecondary'
																>
																	{reminder.hora}
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
																	<Tooltip title='Hecho'>
																		<IconButton
																			size='small'
																			color='success'
																			onClick={() =>
																				handleMarkAsCompleted(reminder)
																			}
																		>
																			<CheckIcon fontSize='small' />
																		</IconButton>
																	</Tooltip>
																</Stack>
															</Tooltip>
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
				onClose={handleCloseModal}
				onSave={handleSaveReminderFromModal}
				reminder={selectedReminder}
				columnId={activeColumn} // Agregar esta línea
			/>

			<QuickReminderModal
				open={quickModalOpen}
				onClose={handleCloseQuickModal}
				onSave={handleSaveQuickReminder}
				columnId={quickModalColumn}
			/>
		</>
	);
};

export default Kanban;
