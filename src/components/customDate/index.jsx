import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import { Box, Button, Grow, Paper, useTheme } from '@mui/material';
import { Calendar } from 'react-date-range';
import { es } from 'date-fns/locale';
import { paperClasses } from '@mui/material/Paper';
import { format } from 'date-fns';
const CustomDate = (props) => {
	const theme = useTheme();
	const [visible, setVisible] = useState(false);
	const toggleVisible = () => setVisible((prevState) => !prevState);

	useEffect(() => {
		if (visible) {
			toggleVisible();
		}
	}, [props.date]);

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
					sx={{ width: '100%' }}
					onClick={toggleVisible}
					variant={'outlined'}
				>
					{format(props.date, 'dd MMM yy', {
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
						<Calendar
							{...props}
							locale={es}
							color={theme.palette.secondary.main}
						/>
					</Box>
				</Grow>
			</Box>
		</Fragment>
	);
};

CustomDate.propTypes = {};

export default CustomDate;
