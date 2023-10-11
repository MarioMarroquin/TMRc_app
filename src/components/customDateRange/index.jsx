import PropTypes from 'prop-types';
import { DateRange } from 'react-date-range';
import { Box, Button, Grow, Paper, useTheme } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { format } from 'date-fns';
import './index.css';
import { paperClasses } from '@mui/material/Paper';
import { es } from 'date-fns/locale';
import { CalendarIcon } from '@mui/x-date-pickers';
import { pxToRem } from '@config/theme/functions';

const CustomDateRange = (props) => {
	const theme = useTheme();
	const [visible, setVisible] = useState(false);
	const toggleVisible = () => setVisible((prevState) => !prevState);

	useEffect(() => {
		if (visible) {
			if (props.ranges[0].startDate !== props.ranges[0].endDate) {
				toggleVisible();
			}
		}
	}, [props.ranges[0]]);

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
				}}
			>
				<Button
					sx={{
						width: 332,
						height: '100%',
						bgcolor: '#f9f9f9',
						border: 'none',
						borderRadius: pxToRem(12),
						'&:hover': {
							backgroundColor: '#f7faff',
							border: 'none',
						},
						'&.Mui-focused': {
							backgroundColor: '#f9fcff',

							'&:hover': {
								backgroundColor: '#f7faff',
							},
						},
					}}
					onClick={toggleVisible}
					variant={'outlined'}
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

				<Grow in={visible}>
					<Box
						component={Paper}
						sx={{
							zIndex: 1000,
							position: 'absolute',
							mt: 2,
						}}
					>
						<DateRange
							{...props}
							editableDateInputs={true}
							showDateDisplay={false}
							rangeColors={[theme.palette.secondary.main]}
							locale={es}
						/>
					</Box>
				</Grow>
			</Box>
		</Fragment>
	);
};

CustomDateRange.propTypes = {
	ranges: PropTypes.array,
};

export default CustomDateRange;
