import PropTypes from 'prop-types';
import { Fragment } from 'react';
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

const NewRequestDialog = ({ visibility, toggleVisibility }) => {

	return (
		<Fragment>
			<Button sx={{ ml: 'auto' }} disableRipple>
				Open
			</Button>

			<Dialog open={visibility}>
				<DialogTitle>Nueva solicitud</DialogTitle>
				<DialogContent>
					<Grid container columnSpacing={1}>
						<Grid item><DateTimePicker
							label='Fecha'
							value={}
							formatDensity={'spacious'}
							sx={{
								'&.Mui-selected': {
									color: 'secondary',
								},
							}}
							onChange={}
						/></Grid>
						<Grid item>lol</Grid>
						<Grid item>lol</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
		</Fragment>
	);
};

NewRequestDialog.propTypes = {
	visibility: PropTypes.bool.isRequired,
	toggleVisibility: PropTypes.func.isRequired,
};

export default NewRequestDialog;
