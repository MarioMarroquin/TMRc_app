import Draggable from 'react-draggable';
import { Paper } from '@mui/material';

const DraggablePaper = (props) => {
	return (
		<Draggable
			handle='#dialogTitleDrag'
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
};

export default DraggablePaper;
