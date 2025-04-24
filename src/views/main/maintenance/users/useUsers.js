import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client'; // 🆕
import { GET_USERS } from '@views/main/maintenance/users/queryRequests.js';

const emptyUser = {
	nombre: '',
	apellido: '',
	rol: '',
	usuario: '',
	telefono: '',
	email: '',
	activo: true,
};

export const useUsers = () => {
	const { data, loading, error } = useQuery(GET_USERS); // 🆕
	const [users, setUsers] = useState([]);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [userData, setUserData] = useState(emptyUser);
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		if (data?.users?.results) {
			const formatted = data.users.results.map((user) => ({
				id: user.id,
				nombre: user.firstName,
				apellido: user.lastName,
				rol: user.role,
				telefono: user.phoneNumber,
				usuario: user.username,
				email: user.email,
				activo: true,
			}));
			setUsers(formatted);
		}
	}, [data]); // 🆕 carga los datos una vez que están disponibles

	const toggleActivo = (id) => {
		setUsers((prev) =>
			prev.map((user) =>
				user.id === id ? { ...user, activo: !user.activo } : user
			)
		);
	};

	const handleAddUserClick = () => {
		setUserData(emptyUser);
		setIsEdit(false);
		setOpenModal(true);
	};

	const handleEditUser = (user) => {
		setUserData({ ...user });
		setIsEdit(true);
		setOpenModal(true);
	};

	const handleSaveUser = () => {
		if (!userData.nombre || !userData.usuario) {
			alert('El nombre y el usuario son obligatorios.');
			return;
		}

		if (isEdit) {
			setUsers((prev) =>
				prev.map((u) => (u.id === userData.id ? userData : u))
			);
		} else {
			setUsers((prev) => [...prev, { ...userData, id: Date.now() }]);
		}
		setOpenModal(false);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleDeleteUserClick = (user) => {
		setSelectedUser(user);
		setOpenDeleteDialog(true);
	};

	const handleConfirmDelete = () => {
		setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
		setOpenDeleteDialog(false);
	};

	const handleCancelDelete = () => {
		setSelectedUser(null);
		setOpenDeleteDialog(false);
	};

	return {
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
		loading,
		error,
	};
};
