import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
	Box,
	Button,
	Container,
	FormControl,
	FormControlLabel,
	Grid,
	Radio,
	RadioGroup,
	Stack,
	Switch,
	Typography,
} from '@mui/material';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

import ListReminder from '@views/main/reminders/Enums/list.jsx';
import Kanban from '@views/main/reminders/Enums/Kanban.jsx';
import CompleteList from './Enums/CompleteReminders.jsx';
import { reminderData } from './ReminderData.js';
import ButtonAddReminder from '@views/main/reminders/Enums/ButtonAddReminder.jsx';
import { useReminders } from '@views/main/reminders/useReminders.js';

const Reminders = () => {
	const {
		listData,
		setListData,
		completedList,
		setCompletedList,
		ListoClick,
		handleDeleteClick,
		handleConfirmDelete,
		handleCancelDelete,
		openDialog,
		selectedItem,
		selectedView,
		setSelectedView,
	} = useReminders();

	const [showList, setShowList] = useState(
		!!JSON.parse(localStorage.getItem('showList'))
	);

	useEffect(() => {
		localStorage.setItem('showList', JSON.stringify(showList));
	}, [showList]);

	// 👇 Esto es lo que se pasa al componente ListReminder
	const filteredListData = Array.isArray(listData)
		? listData.filter((group) => group.LIST && group.LIST.length > 0)
		: [];
	console.log('filteredListData:', filteredListData);
	return (
		<Container sx={{ paddingTop: '5px' }}>
			<Grid
				container
				alignItems='center'
				justifyContent='space-between'
				sx={{ mb: 2 }}
			>
				<Grid item>{showList && <ButtonAddReminder />}</Grid>

				<Grid item>
					{showList && (
						<FormControl component='fieldset'>
							<RadioGroup
								row
								aria-label='vista'
								name='selectedView'
								value={selectedView}
								onChange={(e) => setSelectedView(e.target.value)}
							>
								<FormControlLabel
									value='pasado'
									control={<Radio />}
									label='Pasado'
								/>
								<FormControlLabel value='hoy' control={<Radio />} label='Hoy' />
								<FormControlLabel
									value='Listo'
									control={<Radio />}
									label='Listo'
								/>
							</RadioGroup>
						</FormControl>
					)}
				</Grid>

				<Grid item>
					<Stack direction='row' alignItems='center' spacing={1}>
						<Typography variant='button' fontWeight='bold'>
							Kanban
						</Typography>
						<ViewWeekIcon />
						<Switch
							checked={showList}
							onChange={(event) => {
								const checked = event.target.checked;
								if (!checked && selectedView === 'Listo') {
									setSelectedView('hoy');
								}
								setShowList(checked);
							}}
						/>
						<PlaylistAddCheckCircleIcon />
						<Typography variant='button' fontWeight='bold'>
							Lista
						</Typography>
					</Stack>
				</Grid>
			</Grid>

			{selectedView === 'Listo' ? (
				<CompleteList CompleteList={completedList} />
			) : showList ? (
				<ListReminder
					listData={filteredListData}
					setListData={setListData}
					completedList={completedList}
					setCompletedList={setCompletedList}
					ListoClick={ListoClick}
					handleDeleteClick={handleDeleteClick}
					handleConfirmDelete={handleConfirmDelete}
					handleCancelDelete={handleCancelDelete}
					openDialog={openDialog}
					selectedItem={selectedItem}
				/>
			) : (
				<Kanban reminderData={reminderData} selectedView={selectedView} />
			)}
		</Container>
	);
};

Reminders.propTypes = {};

export default Reminders;
