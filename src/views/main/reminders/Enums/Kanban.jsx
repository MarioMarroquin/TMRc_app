import { Grid, Typography, Paper, Box } from '@mui/material';
import KanbanReminder from '@views/main/reminders/Enums/KanbanReminder.jsx';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect } from 'react';
import { isBefore, isAfter, isToday, parse } from 'date-fns';
import { useReminders } from '@views/main/reminders/useReminders.js';

const Kanban = ({ reminderData, selectedView }) => {
	const { columns, setColumns, onDragEnd, formatReminderDataForKanban } =
		useReminders();

	useEffect(() => {
		const savedColumns = localStorage.getItem('kanbanColumns');

		if (savedColumns) {
			setColumns(JSON.parse(savedColumns));
		} else if (reminderData) {
			const columnasFormateadas = formatReminderDataForKanban(reminderData);
			setColumns(columnasFormateadas);
			localStorage.setItem(
				'kanbanColumns',
				JSON.stringify(columnasFormateadas)
			);
		}
	}, [reminderData]);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Grid container spacing={45} sx={{ padding: 2 }}>
				{columns &&
					Object.entries(columns).map(([status, items]) => (
						<Grid item xs={12} md={4} key={status}>
							<Paper
								elevation={3}
								sx={{
									padding: 2,
									px: 1,
									backgroundColor: '#F0F0F0',
									minHeight: '610px',
									borderRadius: 12,
								}}
							>
								<Typography
									variant='h6'
									gutterBottom
									sx={{
										display: 'flex',
										justifyContent: 'center',
										textTransform: 'uppercase',
										fontWeight: 'bold',
										letterSpacing: '5px',
									}}
								>
									{status}
								</Typography>

								<Droppable droppableId={status}>
									{(provided) => (
										<Box
											ref={provided.innerRef}
											{...provided.droppableProps}
											sx={{
												overflowY: 'auto',
												maxHeight: '550px',
												paddingRight: 1,
												display: 'flex',
												flexDirection: 'column',
											}}
										>
											{items.length === 0 ? (
												<Typography
													variant='h6'
													color='text.secondary'
													align='center'
													sx={{
														marginTop: 250,
														fontWeight: 'bold',
														color: '#aaa',
													}}
												>
													Arrastra un recordatorio aquí
												</Typography>
											) : (
												items.map((item, index) => (
													<Draggable
														draggableId={item.id}
														index={index}
														key={item.id}
													>
														{(provided) => (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
															>
																<KanbanReminder
																	folio={item.id}
																	servicio={item.title}
																	fecha={item.description}
																/>
															</div>
														)}
													</Draggable>
												))
											)}
											{provided.placeholder}
										</Box>
									)}
								</Droppable>
							</Paper>
						</Grid>
					))}
			</Grid>
		</DragDropContext>
	);
};

export default Kanban;
