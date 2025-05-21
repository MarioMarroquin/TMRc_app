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
	Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { CreateReminderModal } from '@views/main/reminders/Enums/CreateReminderModal.jsx';
import { QuickReminderModal } from '@views/main/reminders/Enums/QuickReminderModal.jsx';
import { CardEditModal } from '@views/main/reminders/Enums/CardEditModal';
import { useKanban } from '@views/main/reminders/Enums/useKanban.js';
import ButtonAddReminder from './ButtonAddReminder';
import toast from 'react-hot-toast';

const COLUMN_LABELS = {
	VENCIDO: 'VENCIDO',
	HOY: 'HOY',
	'POR VENCER': 'POR VENCER',
};

const Kanban = ({
	handleMarkAsCompleted,
	setListData,
	setDeletedItems,
	deletedItems,
	setCompletedList,
}) => {
	const {
		columns,
		setColumns,
		modalOpen,
		quickModalOpen,
		selectedReminder,
		activeColumn,
		quickModalColumn,
		itemToEdit,
		handleDragStart,
		handleDragEnd,
		handleDrop,
		handleOpenModal,
		handleCloseModal,
		handleOpenQuickModal,
		handleCloseQuickModal,
		handleSaveQuickReminder,
		handleSaveEdit,
		resetKanbanData,
		selectedDate,
		setSelectedDate,
		selectedTime,
		setSelectedTime,
		title,
		setTitle,
		availableDates,
		availableTimes,
		handleQuickReminderSave,
		handleCardEditSave,
		tempRemovedItem,
		sourceColumnId,
		setTempRemovedItem,
		setSourceColumnId,
	} = useKanban();

	const deleteReminder = (id, columnId) => {
		try {
			// 1. Eliminar del Kanban
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				newColumns[columnId] = newColumns[columnId].filter(
					(item) => item.id !== id
				);
				localStorage.setItem('kanbanColumns', JSON.stringify(newColumns));
				return newColumns;
			});

			// 2. Eliminar de listData y actualizar deletedItems
			setListData((prevData) => {
				const newData = prevData
					.map((group) => ({
						...group,
						LIST: group.LIST.filter((item) => item.id !== id),
					}))
					.filter((group) => group.LIST.length > 0);
				localStorage.setItem('listData', JSON.stringify(newData));
				return newData;
			});

			// 3. Actualizar deletedItems
			setDeletedItems((prev) => {
				const newDeletedItems = [...prev, id];
				localStorage.setItem('deletedItems', JSON.stringify(newDeletedItems));
				return newDeletedItems;
			});

			// 4. Disparar eventos de actualización
			window.dispatchEvent(new Event('listDataUpdate'));
			window.dispatchEvent(new Event('kanbanUpdate'));

			toast.error('🗑️ Recordatorio eliminado');
		} catch (error) {
			console.error('Error al eliminar el recordatorio:', error);
			toast.error('Error al eliminar el recordatorio');
		}
	};

	useEffect(() => {
		const loadInitialState = () => {
			try {
				const savedColumns = localStorage.getItem('kanbanColumns');
				const deletedItemsLocal = localStorage.getItem('deletedItems');
				const deletedIds = deletedItemsLocal
					? JSON.parse(deletedItemsLocal)
					: [];

				if (savedColumns) {
					const parsedColumns = JSON.parse(savedColumns);
					// Filtrar elementos eliminados de cada columna
					const filteredColumns = Object.keys(parsedColumns).reduce(
						(acc, columnId) => {
							acc[columnId] = parsedColumns[columnId].filter(
								(item) => !deletedIds.includes(item.id)
							);
							return acc;
						},
						{}
					);

					setColumns(filteredColumns);
				}
			} catch (error) {
				console.error('Error cargando estado inicial:', error);
			}
		};

		loadInitialState();
	}, []);

	return (
		<>
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				p={1}
			>
				<Box>
					<ButtonAddReminder />
				</Box>

				<Box display='flex' gap={2} alignItems='center'>
					<Tooltip title='Agregar nuevo recordatorio'>
						<IconButton
							size='small'
							onClick={() => handleOpenModal('POR VENCER')}
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
			</Box>

			{/* Contenedor Kanban con scroll y mayor espacio entre columnas */}
			<Box
				display='flex'
				gap={3} // Espacio mayor entre las columnas
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
											{columns[columnId].map((reminder) => (
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
															handleDragStart(e, reminder, columnId)
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
																				'¿Quieres eliminar este recordatorio?'
																			)
																		) {
																			deleteReminder(reminder.id, columnId);
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
																<Tooltip title='Listo'>
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
											))}
										</Stack>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Box>

			<CreateReminderModal
				open={modalOpen && !selectedReminder}
				onClose={handleCloseModal}
				columns={columns}
				setColumns={setColumns} // Agregar esta línea
			/>

			<CardEditModal
				open={modalOpen && selectedReminder}
				onClose={handleCloseModal}
				reminder={itemToEdit}
				columnId={activeColumn}
				setColumns={setColumns}
				tempRemovedItem={tempRemovedItem}
				sourceColumnId={sourceColumnId}
				setTempRemovedItem={setTempRemovedItem}
				setSourceColumnId={setSourceColumnId}
			/>

			<QuickReminderModal
				open={quickModalOpen}
				onClose={handleCloseQuickModal}
				columnId={quickModalColumn}
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
				selectedTime={selectedTime}
				setSelectedTime={setSelectedTime}
				title={title}
				setTitle={setTitle}
				availableDates={availableDates}
				availableTimes={availableTimes}
				onSave={handleQuickReminderSave}
			/>
		</>
	);
};

export default Kanban;
