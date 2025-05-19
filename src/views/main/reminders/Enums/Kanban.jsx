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

const COLUMN_LABELS = {
	VENCIDO: 'VENCIDO',
	HOY: 'HOY',
	'POR VENCER': 'POR VENCER',
};

const Kanban = ({ handleMarkAsCompleted }) => {
	const {
		columns,
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
		deleteReminder,
		handleSaveEdit,
		resetKanbanData,
	} = useKanban();

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
				// onSave={}
				columnId={activeColumn} // Agregar esta línea
			/>

			<CardEditModal
				open={modalOpen && selectedReminder}
				onClose={handleCloseModal}
				// onSave={}
				reminder={itemToEdit}
				columnId={activeColumn}
			/>

			<QuickReminderModal
				open={quickModalOpen}
				onClose={handleCloseQuickModal}
				onSave={handleSaveQuickReminder}
				columnId={quickModalColumn}
			/>

			<Button onClick={resetKanbanData} variant='contained' sx={{ mb: 2 }}>
				Reiniciar Datos
			</Button>
		</>
	);
};

export default Kanban;
