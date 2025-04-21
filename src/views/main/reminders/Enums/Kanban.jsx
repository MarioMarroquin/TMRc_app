import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useReminders } from '@views/main/reminders/useReminders.js';
import KanbanColumn from '@views/main/reminders/Enums/KanbanColumn.jsx';

const Kanban = () => {
	const { reminders, moveReminder } = useReminders();

	const handleDrop = (reminderId, newStatus) => {
		moveReminder(reminderId, newStatus);
	};

	useEffect(() => {
		console.log('My reminders: ', reminders);
	}, [reminders]);

	return (
		<Box display='flex' justifyContent='space-between' gap={2} p={2}>
			{['Vencido', 'hoy', 'Por Vencer'].map((status) => (
				<KanbanColumn
					key={status}
					status={status}
					reminders={reminders[status] || []}
					onDrop={handleDrop}
				/>
			))}
		</Box>
	);
};

export default Kanban;
