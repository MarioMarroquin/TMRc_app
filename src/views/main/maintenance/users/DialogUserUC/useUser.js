import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
	EDIT_USER,
	CREATE_USER,
} from '@views/main/maintenance/users/mutationUsers.js';
import toast from 'react-hot-toast';
import { useLoaderContext } from '@providers/loader';

const BlankUser = {
	firstName: '',
	lastName: '',
	role: '',
	username: '',
	phoneNumber: '',
	email: '',
	password: '',
	active: true,
};

const useUser = (
	refetchUsers,
	userDialogStatus,
	closeUserDialog,
	openUserCreateDialog
) => {
	const { loadingOn, loadingOff } = useLoaderContext();
	const [user, setUser] = useState(BlankUser);
	const [createUser] = useMutation(CREATE_USER);
	const [editUser] = useMutation(EDIT_USER);

	const cleanStates = () => {
		setUser(BlankUser);
	};

	const handleInputUser = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const handleInputPhoneNumber = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setUser({ ...user, phoneNumber });
		} else {
			const aux = phoneNumber.split(' ').join('');
			if (/^\d+$/.test(aux) && aux.length <= 10)
				setUser({ ...user, phoneNumber: aux });
		}
	};

	const onOpen = () => {
		openUserCreateDialog();
	};

	const onClose = () => {
		closeUserDialog();
		cleanStates();
	};

	const onFinishCreate = async (e) => {
		e.preventDefault();
		loadingOn();

		const { active, ...aux } = user;

		await createUser({ variables: { user: aux } })
			.then((res) => {
				if (!res.errors) {
					toast.success('Usuario creado exitosamente.');
					refetchUsers();
					onClose();
				} else {
					console.log('Errores', res.errors);
					toast.error('Error al crear');
				}
				loadingOff();
			})
			.catch((error) => {
				console.log('Error', error);
				toast.error('Ocurrió un error');
				loadingOff();
			});
	};

	const onFinishUpdate = async (e) => {
		e.preventDefault();
		loadingOn();

		const { active, __typename, ...aux } = user;
		const { userId } = userDialogStatus;

		await editUser({ variables: { userId, user: aux } })
			.then((res) => {
				if (!res.errors) {
					toast.success('Usuario editado exitosamente.');
					refetchUsers();
					onClose();
				} else {
					console.log('Errores', res.errors);
					toast.error('Error al crear');
				}
				loadingOff();
			})
			.catch((error) => {
				console.log('Error', error);
				toast.error('Ocurrió un error');
				loadingOff();
			});
	};

	useEffect(() => {
		const { visible, editMode, user } = userDialogStatus;

		if (visible) {
			if (editMode) setUser(user);
		}
	}, [userDialogStatus.visible]);

	return {
		user,
		onCreate: onFinishCreate,
		onEdit: onFinishUpdate,
		isVisible: userDialogStatus.visible,
		isEditable: userDialogStatus.editMode,
		onClose,
		onOpen,
		handleInputUser,
		handleInputPhoneNumber,
	};
};

export default useUser;
