import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import UsersTable from './UsersTable';
import UserModal from './UserModal';
import { useUsers } from './useUsers';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
	typography: {
		fontFamily: 'Inter, sans-serif',
	},
});

const UsersPage = () => {
	const {
		users,
		selectedUser,
		openDeleteDialog,
		handleEditUser,
		handleAddUserClick,
		handleDeleteUserClick,
		handleConfirmDelete,
		handleCancelDelete,
		openModal,
		userData,
		setUserData,
		handleSaveUser,
		handleCloseModal,
		isEdit,
		toggleActivo,
	} = useUsers();

	return (
		<ThemeProvider theme={theme}>
			<Container maxWidth='xl'>
				<Typography
					variant='h4'
					gutterBottom
					sx={{ textAlign: 'center', fontFamily: 'Inter', fontWeight: 'bold' }}
				>
					Usuarios
				</Typography>
				<UsersTable
					users={users}
					selectedUser={selectedUser}
					openDeleteDialog={openDeleteDialog}
					handleEditUser={handleEditUser}
					handleAddUserClick={handleAddUserClick}
					handleConfirmDelete={handleConfirmDelete}
					handleCancelDelete={handleCancelDelete}
					handleDeleteUserClick={handleDeleteUserClick}
					toggleActivo={toggleActivo}
				/>

				<UserModal
					open={openModal}
					handleClose={handleCloseModal}
					handleSave={handleSaveUser}
					userData={userData}
					setUserData={setUserData}
					isEdit={isEdit}
				/>
			</Container>
		</ThemeProvider>
	);
};

export default UsersPage;
