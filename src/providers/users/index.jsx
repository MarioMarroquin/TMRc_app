import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const UsersContext = createContext({});

const UsersProvider = ({ children }) => {
	const value = {};

	return (
		<UsersContext.Provider value={value}>{children}</UsersContext.Provider>
	);
};

UsersProvider.propTypes = {
	children: PropTypes.element.isRequired,
};

function useUsersContext() {
	return useContext(UsersContext);
}

export { UsersContext, UsersProvider, useUsersContext };
