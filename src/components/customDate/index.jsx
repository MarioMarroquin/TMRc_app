import { Fragment, useEffect, useState } from 'react';
import { Box, Button, Grow, Paper, useTheme } from '@mui/material';
import { Calendar } from 'react-date-range';
import { es } from 'date-fns/locale';
import { paperClasses } from '@mui/material/Paper';
import { format } from 'date-fns';
import { pxToRem } from '@config/theme/functions';
import './index.css';

const CustomDate = (props) => {
	const theme = useTheme();
	const [visible, setVisible] = useState(false);
	const toggleVisible = () => setVisible((prevState) => !prevState);

	useEffect(() => {
		if (visible) {
			toggleVisible();
		}
	}, [props.date]);

	if (props.extended) {
		return (
			<Fragment>
				<Calendar {...props} locale={es} color={theme.palette.secondary.main} />
			</Fragment>
		);
	}

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
					sx={{
						width: '100%',
						height: '100%',
						bgcolor: '#f9f9f9',
						borderRadius: `${pxToRem(12)} ${pxToRem(12)} 0 0`,
						'&:hover': {
							backgroundColor: '#f7faff',
							border: 'none',
							borderBottom: '1px solid #00000050',
						},
						'&.Mui-focused': {
							backgroundColor: '#f9fcff',

							'&:hover': {
								backgroundColor: '#f7faff',
							},
						},
						border: 'none',
						borderBottom: '1px solid #00000050',
					}}
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
