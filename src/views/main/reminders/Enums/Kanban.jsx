import { useState } from 'react';
import {
	useReminders,
	sortRemindersByDate,
} from '@views/main/reminders/useReminders.js'; // Asegúrate de importar la función
import '@views/main/reminders/Enums/Kanban.css';

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
	} = useReminders();

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

					{/* Verifica si no hay recordatorios en la columna */}
					{columns[columnId].length === 0 ? (
						<div className='empty-column-message'>
							Arrastra un recordatorio aquí
						</div>
					) : (
						sortRemindersByDate(columns[columnId]).map((reminder) => (
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
								<div className='kanban-card-date'>
									📅 {reminder.description}
								</div>
							</div>
						))
					)}
				</div>
			))}
		</div>
	);
};

export default Kanban;
