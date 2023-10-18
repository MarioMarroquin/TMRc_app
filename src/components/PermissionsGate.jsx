import PropTypes from 'prop-types';
import { useSession } from '@providers/session';
import { PERMISSIONS } from '@config/permisissions/permissions';
import { cloneElement, Fragment } from 'react';

const hasPermission = ({ permissions, scopes }) => {
	const scopesMap = {};
	scopes.forEach((scope) => {
		scopesMap[scope] = true;
	});

	return permissions.some((permission) => scopesMap[permission]);
};

const PermissionsGate = ({
	children,
	RenderError = () => <></>,
	errorProps = null,
	scopes = [],
}) => {
	const { role } = useSession();
	const permissions = PERMISSIONS[role];

	const permissionGranted = hasPermission({ permissions, scopes });

	if (!permissionGranted && !errorProps) return <RenderError />;

	if (!permissionGranted && errorProps)
		return cloneElement(children, { ...errorProps });

	return <Fragment>{children}</Fragment>;
};

PermissionsGate.propTypes = {
	children: PropTypes.element,
	RenderError: PropTypes.element,
	errorProps: PropTypes.object,
	scopes: PropTypes.array,
};

export default PermissionsGate;
