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
import { CreateReminderModal } from './CreateReminderModal';
import QuickReminderModal from '@views/main/reminders/Enums/QuickReminderModal.jsx';
import { CardEditModal } from './CardEditModal';
import { useKanban } from './useKanban';
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
	completedList,
	selectedView,
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
		handleQuickReminderSave,
		handleCardEditSave,
		tempRemovedItem,
		sourceColumnId,
		setTempRemovedItem,
		setSourceColumnId,
	} = useKanban();

	const deleteReminder = (id, columnId) => {
		try {
			if (!window.confirm('¿Estás seguro de eliminar este recordatorio?')) {
				return;
			}

			// 1. Encontrar el recordatorio a eliminar
			const reminderToDelete = columns[columnId].find((item) => item.id === id);
			if (!reminderToDelete) return;

			// 2. Actualizar el estado de columns (Kanban)
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				newColumns[columnId] = newColumns[columnId].filter(
					(item) => item.id !== id
				);
				localStorage.setItem('kanbanColumns', JSON.stringify(newColumns));
				return newColumns;
			});

			// 3. Actualizar listData (List)
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

			// 4. Actualizar deletedItems
			setDeletedItems((prev) => {
				const newDeletedItems = [...prev, id];
				localStorage.setItem('deletedItems', JSON.stringify(newDeletedItems));
				return newDeletedItems;
			});

			toast.error('🗑️ Recordatorio eliminado');
		} catch (error) {
			console.error('Error al eliminar el recordatorio:', error);
			toast.error('Error al eliminar el recordatorio');
		}
	};

	const [localCompletedList, setLocalCompletedList] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem('completedList')) || [];
		} catch (error) {
			console.error('Error loading completedList:', error);
			return [];
		}
	});

	const handleComplete = async (reminder, columnId) => {
		try {
			// 1. Crear el item completado con el formato correcto para CompleteReminders
			const completedItem = {
				id: reminder.id,
				FOLIO: reminder.folio,
				SERVICIO: reminder.title,
				EMPRESA: reminder.empresa,
				CLIENTE: reminder.cliente,
				CONTACT: reminder.contact,
				FECHA: reminder.description.split(' - ')[0],
				completedDate: new Date().toISOString(),
				// Incluir campos adicionales si son necesarios
				type: reminder.type,
				description: reminder.description,
			};

			// 2. Actualizar completedList
			setCompletedList((prev) => {
				const newCompletedList = [...(prev || []), completedItem];
				// Persistir en localStorage
				localStorage.setItem('completedList', JSON.stringify(newCompletedList));
				return newCompletedList;
			});

			// 3. Eliminar de las columnas del Kanban
			setColumns((prev) => {
				const newColumns = { ...prev };
				newColumns[columnId] = newColumns[columnId].filter(
					(item) => item.id !== reminder.id
				);
				localStorage.setItem('kanbanColumns', JSON.stringify(newColumns));
				return newColumns;
			});

			// 4. Eliminar de listData
			setListData((prev) => {
				const newListData = prev
					.map((group) => ({
						...group,
						LIST: group.LIST.filter((item) => item.id !== reminder.id),
					}))
					.filter((group) => group.LIST.length > 0);
				localStorage.setItem('listData', JSON.stringify(newListData));
				return newListData;
			});

			// 5. Notificar actualización
			window.dispatchEvent(
				new CustomEvent('completedListUpdate', {
					detail: completedItem,
				})
			);

			toast.success('✔️ Recordatorio completado');
		} catch (error) {
			console.error('Error al completar el recordatorio:', error);
			toast.error('Error al completar el recordatorio');
		}
	};

	// Efecto para restaurar datos al montar
	useEffect(() => {
		const restoreData = () => {
			try {
				const savedColumns = localStorage.getItem('kanbanColumns');
				if (savedColumns) {
					const parsedColumns = JSON.parse(savedColumns);
					// Filtrar items eliminados y completados
					const filteredColumns = Object.keys(parsedColumns).reduce(
						(acc, columnId) => {
							acc[columnId] = parsedColumns[columnId].filter(
								(item) => !deletedItems.includes(item.id)
							);
							return acc;
						},
						{}
					);
					setColumns(filteredColumns);
				}
			} catch (error) {
				console.error('Error restoring kanban data:', error);
			}
		};

		restoreData();
	}, [deletedItems]);

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

			<Box
				display='flex'
				gap={3}
				sx={{
					maxHeight: '80vh',
					overflowY: 'auto',
					p: 2,
				}}
			>
				<Grid container spacing={40}>
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
														<Stack spacing={1}>
															<Box
																display='flex'
																justifyContent='space-between'
															>
																<Chip
																	label={
																		reminder.type === 'personal'
																			? 'Personal'
																			: 'LEAD'
																	}
																	color={
																		reminder.type === 'personal'
																			? 'primary'
																			: 'secondary'
																	}
																	size='small'
																	sx={{ fontWeight: 'bold' }}
																/>

																<Box>
																	<Tooltip title='Completar'>
																		<IconButton
																			size='small'
																			color='success'
																			onClick={() =>
																				handleComplete(reminder, columnId)
																			}
																		>
																			<CheckIcon fontSize='small' />
																		</IconButton>
																	</Tooltip>
																	<Tooltip title='Eliminar'>
																		<IconButton
																			size='small'
																			color='error'
																			onClick={() =>
																				deleteReminder(reminder.id, columnId)
																			}
																		>
																			<CloseIcon fontSize='small' />
																		</IconButton>
																	</Tooltip>
																</Box>
															</Box>

															<Typography
																variant='subtitle2'
																sx={{ whiteSpace: 'pre-wrap' }}
															>
																{reminder.title}
															</Typography>
															<Divider />
															<Typography
																variant='caption'
																color='textSecondary'
															>
																📅 {reminder.description}
															</Typography>
														</Stack>
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
				open={modalOpen && !itemToEdit} // Añade la condición !itemToEdit
				onClose={handleCloseModal}
				columns={columns}
				setColumns={setColumns}
			/>

			<QuickReminderModal
				open={quickModalOpen}
				columnId={quickModalColumn}
				onClose={handleCloseQuickModal}
				onSave={handleQuickReminderSave}
			/>

			<CardEditModal
				open={!!itemToEdit}
				reminder={itemToEdit}
				columnId={activeColumn}
				onClose={handleCloseModal}
				onSave={handleCardEditSave}
				setColumns={setColumns}
				tempRemovedItem={tempRemovedItem}
				sourceColumnId={sourceColumnId}
				setTempRemovedItem={setTempRemovedItem}
				setSourceColumnId={setSourceColumnId}
			/>
		</>
	);
};

export default Kanban;
