import PropTypes from 'prop-types';
import { DateRange } from 'react-date-range';
import { Box, Button, Grow, Paper, useTheme } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { format } from 'date-fns';
import './index.css';
import { paperClasses } from '@mui/material/Paper';
import { Calendar } from '@mui/x-date-pickers/internals/components/icons';
import { es } from 'date-fns/locale';

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
						borderRadius: '24px',
					},
				}}
			>
				<Button
					sx={{ width: 332 }}
					onClick={toggleVisible}
					variant={'outlined'}
					startIcon={<Calendar />}
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
						elevation={12}
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
