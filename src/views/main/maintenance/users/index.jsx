import { useState } from 'react';
import UsersGrid from './UsersGrid';
import DialogUserUC from './DialogUserUC/DialogUserUC';
import { useUsers } from './useUsers';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Users = () => {
	const { users } = useUsers();

	const [userDialogStatus, setUserDialogStatus] = useState({
		visible: false,
		editMode: false,
		user: null,
		userId: null,
	});

	const openUserEditDialog = (user, userId) =>
		setUserDialogStatus({ visible: true, editMode: true, user, userId });

	const closeUserDialog = (userId) =>
		setUserDialogStatus({
			visible: false,
			editMode: false,
			user: null,
			userId: null,
		});

	const openUserCreateDialog = () =>
		setUserDialogStatus({
			visible: true,
			editMode: false,
			user: null,
			userId: null,
		});

	const navigateToRequest = (row) => {
		const { id, ...user } = { ...row.data };
		openUserEditDialog(user, id);
	}; // needs to be string for route params

	return (
		<>
			<DialogUserUC
				refetchUsers={users.fetch}
				userDialogStatus={userDialogStatus}
				closeUserDialog={closeUserDialog}
				openUserCreateDialog={openUserCreateDialog}
			/>

			<UsersGrid users={users.list} doubleClickAction={navigateToRequest} />
		</>
	);
};

export default Users;
