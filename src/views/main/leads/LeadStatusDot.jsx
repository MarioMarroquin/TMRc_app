import PropTypes from 'prop-types';
import {
	Adjust,
	Circle,
	FiberManualRecord,
	RadioButtonChecked,
	RadioButtonUnchecked,
} from '@mui/icons-material';

const LeadStatusDot = ({ status, isSale = false }) => {
	switch (status) {
		case 'PENDING':
			return <RadioButtonUnchecked sx={{ fontSize: 12, color: '#c4c4c4' }} />;
		case 'TRACING':
			return <Adjust sx={{ fontSize: 12, color: '#737373' }} />;
		case 'QUOTED':
			return <RadioButtonChecked sx={{ fontSize: 12 }} color={'info'} />;
		case 'FINISHED':
			return (
				<Circle sx={{ fontSize: 12 }} color={isSale ? 'success' : 'error'} />
			);
	}
};

LeadStatusDot.propTypes = {};

export default LeadStatusDot;
