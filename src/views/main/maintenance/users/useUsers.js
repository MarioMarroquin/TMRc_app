import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'usuarios_data';

const initialUsers = [
	{
		id: 1,
		nombre: 'Juan',
		apellidoPaterno: 'Pérez',
		apellidoMaterno: 'López',
		telefono: '1234567890',
		usuario: 'juanp',
		activo: true,
	},
	{
		id: 2,
		nombre: 'Ana',
		apellidoPaterno: 'García',
		apellidoMaterno: 'Ramírez',
		telefono: '0987654321',
		usuario: 'anagr',
		activo: false,
	},
];

const emptyUser = {
	nombre: '',
	apellidoPaterno: '',
	apellidoMaterno: '',
	telefono: '',
	usuario: '',
	activo: true,
};

export const useUsers = () => {
	const [users, setUsers] = useState(() => {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
		return saved ? JSON.parse(saved) : initialUsers;
	});

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const [openModal, setOpenModal] = useState(false);
	const [userData, setUserData] = useState(emptyUser);
	const [isEdit, setIsEdit] = useState(false);

	// ✅ Guardar automáticamente en localStorage cuando users cambia
	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
	}, [users]);

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
		setUserData({ ...user }); // ← clonamos para evitar editar por referencia
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
	};
};
