import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useRef } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useReminders } from '@views/main/reminders/useReminders.js';

const KanbanReminder = ({ reminder }) => {
	const { handleDelete, handleEdit } = useReminders();
	const cardRef = useRef(null);

	useEffect(() => {
		if (!cardRef.current) return;

		return draggable({
			element: cardRef.current,
			getData: () => ({
				type: 'REMINDER-DND',
				reminderId: reminder.id,
			}),
		});
	}, [reminder.id]);

	return (
		<Card
			ref={cardRef}
			sx={{
				mb: 2,
				cursor: 'grab',
				'&:active': {
					cursor: 'grabbing',
				},
			}}
		>
			<CardContent>
				<Typography variant='h6'>{reminder.title}</Typography>
				<Typography variant='body2' color='text.secondary'>
					{reminder.description}
				</Typography>
				<Box mt={1} display='flex' justifyContent='flex-end' gap={1}>
					<IconButton onClick={() => handleEdit(reminder)}>
						<EditIcon fontSize='small' />
					</IconButton>
					<IconButton onClick={() => handleDelete(reminder.id)}>
						<DeleteIcon fontSize='small' />
					</IconButton>
				</Box>
			</CardContent>
		</Card>
	);
};

export default KanbanReminder;
