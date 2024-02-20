import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

const Index = (props) => {
	const navigate = useNavigate();

	return (
		<div>
			<Typography>Esta es la pagina de maintenance</Typography>
			<Button
				onClick={() => {
					navigate('clients');
				}}
			>
				IR
			</Button>
			<Outlet />
		</div>
	);
};

Index.propTypes = {};

export default Index;
