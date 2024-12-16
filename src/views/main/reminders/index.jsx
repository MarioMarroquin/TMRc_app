import PropTypes from 'prop-types';
import { Fragment } from 'react';
import {
	Box,
	Button,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
} from '@mui/material';
import toast from 'react-hot-toast';
import { Sync } from '@mui/icons-material';
import DialogLeadCreate from '@views/main/leads/DialogLeadCreate/DialogLeadCreate';

const Reminders = (props) => {
	return (
		<Fragment>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-end',
					mt: 8,
					mb: 16,
				}}
			>
				<Button color={'secondary'} onClick={() => {}}>
					<Sync />
				</Button>

				{/* <DialogLeadCreate refetchRequests={leads.fetch} /> */}
			</Box>

			<Box sx={{ mt: 16, bgcolor: 'white', borderRadius: 8 }}>
				<List
					sx={{
						width: '100%',
						maxWidth: 360,
						bgcolor: 'background.paper',
						position: 'relative',
						overflow: 'auto',
						maxHeight: 300,
						'& ul': { padding: 0 },
					}}
					subheader={<li />}
				>
					{[0, 1, 2, 3, 4].map((sectionId) => (
						<li key={`section-${sectionId}`}>
							<ul>
								<ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
								{[0, 1, 2].map((item) => (
									<ListItem key={`item-${sectionId}-${item}`}>
										<ListItemText primary={`Item ${item}`} />
									</ListItem>
								))}
							</ul>
						</li>
					))}
				</List>
			</Box>
		</Fragment>
	);
};

Reminders.propTypes = {};

export default Reminders;
