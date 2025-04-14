import { useMutation } from '@apollo/client';
import { CREATE_LEAD_REMINDER } from '@views/main/reminders/mutationLeadReminders';
import toast from 'react-hot-toast';
import { useState } from 'react';

const BlankData = {
	message: '',
	notificationDate: new Date(),
	daysHope: null,
};

const useReminderCreate = () => {
	const [createLeadReminder] = useMutation(CREATE_LEAD_REMINDER);
	const [reminder, setReminder] = useState(BlankData);
	const [dialogReminderCreateState, setDialogReminderCreateState] = useState({
		visible: false,
	});

	const createReminder = async (onClose, leadId, refetch) => {
		createLeadReminder({
			variables: { leadId, message: '', notificationDate: '', daysHope: 1 },
		})
			.then((res) => {
				toast.success('Lead reminder created successfully.');
			})
			.catch((e) => {
				console.log('Catch error on createLeadReminder: ', e);
				toast.error('Error creating lead reminder: ' + e);
			});
	};

	const handleInputMessage = (e) => {
		const { name, value } = e.target;
		setReminder({ ...reminder, [name]: value });
	};

	const handleDateChange = (e) => {
		console.log('date', e);
	};

	const openDialog = () => {
		setDialogReminderCreateState({ visible: true });
	};

	const closeDialog = () => {
		setDialogReminderCreateState({ visible: false });
	};

	const VarReminder = () => {
		closeDialog();
	};
	const SuccessAlert = () => {
		toast.success('Se cargo exitosamente en la seccion de recordatorio');
	};

	const manejarClick = () => {
		VarReminder();
		SuccessAlert();
	};

	return {
		createReminder,
		reminder,
		handleInputMessage,
		handleDateChange,
		dialogReminderCreateState,
		openDialog,
		closeDialog,
		manejarClick,
	};
};

export default useReminderCreate;
