import PropTypes from 'prop-types';
import { DateRange, DateRangePicker } from 'react-date-range';
import {
	Box,
	Button,
	Grow,
	MenuItem,
	Paper,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { format } from 'date-fns';
import './index.css';
import { paperClasses } from '@mui/material/Paper';
import { es } from 'date-fns/locale';
import { CalendarIcon } from '@mui/x-date-pickers';
import { pxToRem } from '@config/theme/functions';
import CustomMenu from '@components/customMenu';
import toast from 'react-hot-toast';

const CustomDateRange = (props) => {
	const [anchorMenu, setAnchorMenu] = useState(null);
	const handleOpenMenu = (event) => {
		setAnchorMenu(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorMenu(null);
	};

	const theme = useTheme();

	useEffect(() => {
		if (anchorMenu) {
			if (props.ranges[0].startDate !== props.ranges[0].endDate) {
				handleCloseMenu();
				props.fetch();
			}
		}
	}, [props.ranges[0]]);

	const isXS = useMediaQuery(theme.breakpoints.down('sm'));

	if (props.extended) {
		return (
			<Fragment>
				{/* <DateRange */}
				{/* 	{...props} */}
				{/* 	editableDateInputs={true} */}
				{/* 	showDateDisplay={false} */}
				{/* 	rangeColors={[theme.palette.secondary.main]} */}
				{/* 	locale={es} */}
				{/* /> */}
			</Fragment>
		);
	}

	return (
		<Fragment>
			<Box
				sx={{
					[`& .${paperClasses.root}`]: {
						borderRadius: '16px',
						boxShadow: `0px 15px 16px rgba(3, 7, 18, 0.20),
												0px 60px 65px rgba(3, 7, 18, 0.10);
												`,
					},
					height: '100%',
				}}
			>
				<Button
					sx={{
						minWidth: 292,
						height: '100%',
						bgcolor: '#f9f9f9',
					}}
					onClick={handleOpenMenu}
					variant={'text'}
					startIcon={<CalendarIcon />}
				>
					{format(props.ranges[0].startDate, 'dd MMM yy', {
						locale: es,
					})}
					&nbsp;&nbsp;&nbsp;a&nbsp;&nbsp;&nbsp;
					{format(props.ranges[0].endDate, 'dd MMM yy', {
						locale: es,
					})}
				</Button>

				<CustomMenu
					anchorEl={anchorMenu}
					open={Boolean(anchorMenu)}
					onClose={() => toast('Elige un rango de fechas')}
				>
					<Box
						sx={{
							display: 'flex',
							width: { xs: '100%', sm: 800 },
							p: 8,
						}}
					>
						{/* <DateRange */}
						{/*	{...props} */}
						{/*	editableDateInputs={true} */}
						{/*	showDateDisplay={false} */}
						{/*	rangeColors={[theme.palette.secondary.main]} */}
						{/*	locale={es} */}
						{/* /> */}

						<DateRangePicker
							{...props}
							showSelectionPreview={true}
							moveRangeOnFirstSelection={false}
							rangeColors={[theme.palette.secondary.main]}
							months={2}
							direction={isXS ? 'vertical' : 'horizontal'}
							locale={es}
						/>
					</Box>
				</CustomMenu>
			</Box>
		</Fragment>
	);
};

CustomDateRange.propTypes = {
	ranges: PropTypes.array,
	extended: PropTypes.bool,
};

export default CustomDateRange;
