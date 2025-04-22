import { useState } from 'react';
import { useReminders } from '@views/main/reminders/useReminders.js';
import '@views/main/reminders/Enums/Kanban.css';

const COLUMN_LABELS = {
	VENCIDO: 'VENCIDO',
	HOY: 'HOY',
	'POR VENCER': 'POR VENCER',
};

const Kanban = () => {
	const { columns, moveReminder, onDragEnd } = useReminders();
	const [draggingId, setDraggingId] = useState(null);
	const [draggingColumnId, setDraggingColumnId] = useState(null);

	const handleDragStart = (event, reminderId, columnId) => {
		setDraggingId(reminderId);
		setDraggingColumnId(columnId);
		event.dataTransfer.setData('reminderId', reminderId);
		event.dataTransfer.setData('sourceColumn', columnId);
		event.target.classList.add('dragging');
	};

	const handleDragEnd = (event) => {
		event.target.classList.remove('dragging');
		setDraggingId(null);
		setDraggingColumnId(null);
	};

	const handleDrop = (event, targetColumnId) => {
		const reminderId = event.dataTransfer.getData('reminderId');
		const sourceColumn = event.dataTransfer.getData('sourceColumn');

		if (sourceColumn !== targetColumnId) {
			moveReminder(reminderId, targetColumnId);
		}
	};

	return (
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
					</div>

					{columns[columnId].map((reminder) => (
						<div
							key={reminder.id}
							className='kanban-card'
							draggable
							onDragStart={(e) => handleDragStart(e, reminder.id)}
							onDragEnd={handleDragEnd}
						>
							<div className='kanban-card-folio'>
								Folio: <strong>{reminder.id}</strong>
							</div>
							<div
								className={`kanban-card-service ${
									reminder.title.toLowerCase() === 'renta' ? 'renta' : 'venta'
								}`}
							>
								{reminder.title}
							</div>
							<div className='kanban-card-date'>📅 {reminder.description}</div>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default Kanban;
