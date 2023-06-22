import PropTypes from 'prop-types';
import TimePicker from 'react-time-picker';
import './index.css';

const CustomTime = (props) => {
	return <TimePicker {...props} clearIcon={null} disableClock />;
};

export default CustomTime;
