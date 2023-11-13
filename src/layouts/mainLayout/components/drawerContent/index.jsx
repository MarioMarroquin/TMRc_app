import { Fragment } from 'react';
import {
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import TMRLogo from '@utils/logo/TMR_logo.svg';
import { routes } from '../../../../routes';
import { pxToRem } from '@config/theme/functions';

const DrawerContent = () => {
	const location = useLocation().pathname;
	const navigate = useNavigate();
	const theme = useTheme();

	const isSelected = (loc) => {
		let color = '';
		if (location.includes(loc)) color = theme.palette.primary.main;

		return color || '#afafaf';
	};

	return (
		<Fragment>
			<Toolbar
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					px: [1],
					mt: pxToRem(24),
				}}
			>
				<img src={TMRLogo} alt={'TMR Logo'} width={100} />
			</Toolbar>

			{/* <Divider /> */}

			<List component={'nav'} sx={{ mt: pxToRem(50) }}>
				{routes.map(({ icon, name, path }) => {
					return (
						<ListItemButton
							key={path}
							selected={location.includes(path)}
							onClick={() => {
								navigate(path, { replace: true });
							}}
							sx={{
								py: 2, // 56px in total
								borderTopRightRadius: 12,
								borderBottomRightRadius: 12,
								'&:hover': {
									backgroundColor: `${theme.palette.secondary.main}15`,
								},
								'&.Mui-selected': {
									color: theme.palette.background.default,
									backgroundColor: theme.palette.primary.main,
									'&:hover': {
										backgroundColor: `${theme.palette.primary.main}90`,
									},
								},
							}}
						>
							<ListItemIcon
								sx={{
									color: 'inherit',
									justifyContent: 'center',
								}}
							>
								{icon}
							</ListItemIcon>
							<ListItemText
								primary={name}
								primaryTypographyProps={{
									variant: 'primaryBold12',
								}}
							/>
						</ListItemButton>
					);
				})}
			</List>
		</Fragment>
	);
};

export default DrawerContent;
