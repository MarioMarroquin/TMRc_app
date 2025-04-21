import { Box, Typography } from '@mui/material';
import KanbanReminder from '@views/main/reminders/Enums/KanbanReminder.jsx';
import { useRef, useEffect } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const KanbanColumn = ({ status, reminders, onDrop }) => {
	const columnRef = useRef(null);

	useEffect(() => {
		if (!columnRef.current) return;

		return dropTargetForElements({
			element: columnRef.current,
			getData: () => ({ type: 'REMINDER-DND', status }),
			onDrop: ({ source }) => {
				const reminderId = source.data?.reminderId;
				if (reminderId) {
					onDrop(reminderId, status);
				}
			},
		});
	}, [status, onDrop]);

	const getStatusLabel = (status) => {
		switch (status) {
			case 'Vencido':
				return 'Vencido';
			case 'hoy':
				return 'Hoy';
			case 'Por Vencer':
				return 'Por Vencer';
			default:
				return status;
		}
	};

	return (
		<Box
			ref={columnRef}
			sx={{
				flex: 1,
				border: '2px dashed lightgray',
				borderRadius: 2,
				p: 2,
				minHeight: '300px',
				bgcolor: '#f9f9f9',
			}}
		>
			<Typography variant='h6' align='center' gutterBottom>
				{getStatusLabel(status)}
			</Typography>
			{reminders.map((reminder) => (
				<KanbanReminder key={reminder.id} reminder={reminder} />
			))}
		</Box>
	);
};

export default KanbanColumn;
