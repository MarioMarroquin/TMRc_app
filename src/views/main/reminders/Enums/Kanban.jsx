import { Grid, Typography, Paper, Box } from '@mui/material';
import KanbanReminder from '@views/main/reminders/Enums/KanbanReminder.jsx';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { isBefore, isAfter, isToday, parse } from 'date-fns';

const Kanban = ({ reminderData }) => {
	const [columns, setColumns] = useState({
		vencidas: [],
		hoy: [],
		'por Vencer': [],
	});

	useEffect(() => {
		if (reminderData && typeof reminderData === 'object') {
			const formateado = {};
			Object.keys(reminderData).forEach((key) => {
				formateado[key] = reminderData[key].map((item) => ({
					id: item.FOLIO || item.folio,
					title: item.SERVICIO || item.servicio,
					description: item.fecha,
				}));
			});
			setColumns(formateado);
		}
	}, [reminderData]);

	const AlertaExito = () => {
		toast.success('¡Elemento guardado correctamente!', {
			duration: 3000,
		});
	};

	const onDragEnd = (result) => {
		const { source, destination } = result;
		if (!destination) return;

		const sourceList = [...columns[source.droppableId]];
		const destList = [...columns[destination.droppableId]];

		const [movedItem] = sourceList.splice(source.index, 1);

		if (source.droppableId === destination.droppableId) {
			sourceList.splice(destination.index, 0, movedItem);
			setColumns({
				...columns,
				[source.droppableId]: sourceList,
			});
		} else {
			destList.splice(destination.index, 0, movedItem);
			setColumns({
				...columns,
				[source.droppableId]: sourceList,
				[destination.droppableId]: destList,
			});
		}
		AlertaExito();
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Grid container spacing={45} sx={{ padding: 2 }}>
				{Object.entries(columns).map(([status, items]) => (
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
