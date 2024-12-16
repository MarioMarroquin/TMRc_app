import { Fragment, useEffect, useState } from 'react';
import {
	Collapse,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import TMRLogo from '@utils/logo/TMR_logo.svg';
import { mainRoutes } from '../../../../routes';
import { pxToRem } from '@config/theme/functions';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import { AxiosHeaders as prev } from 'axios';

const DrawerContent = () => {
	const location = useLocation().pathname;
	const navigate = useNavigate();
	const theme = useTheme();
	const [openNest, setOpenNest] = useState(null);

	const isSelected = (loc) => {
		let color = '';
		if (location.includes(loc)) color = theme.palette.primary.main;

		return color || '#afafaf';
	};

	const handleListNest = (list, route) => {
		if (location.includes(route)) {
			return;
		}
		setOpenNest((prev) => (prev ? null : list));
	};

	useEffect(() => {
		const aux = location.split('/')[1];

		const lol = mainRoutes.find((obj) => obj.mainPath === '/'.concat('', aux));
		console.log(lol);
		if (lol) setOpenNest(lol.mainName);
	}, []);

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

			<List component={'nav'} sx={{ mt: pxToRem(50), p: 4 }}>
				{mainRoutes.map(
					({
						icon,
						name,
						path,
						nested,
						mainName,
						mainPath,
						routes,
						mainIcon,
						active,
					}) => {
						if (nested) {
							return (
								<>
									<ListItemButton
										disableRipple
										disableTouchRipple
										key={path}
										selected={location.includes(mainPath)}
										onClick={() => {
											handleListNest(mainName, mainPath);
										}}
										disabled={!active}
										sx={{
											color: '#1313134F',
											m: 4,
											pl: 0,
											borderRadius: 8,
											'&:hover': {
												backgroundColor: 'transparent',
											},
											'&.Mui-selected': {
												backgroundColor: 'transparent',
												color: theme.palette.primary.main,
												'&:hover': {
													backgroundColor: 'transparent',
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
											{openNest === mainName ? <ExpandLess /> : <ExpandMore />}
										</ListItemIcon>
										<ListItemText
											primary={mainName}
											primaryTypographyProps={{
												fontSize: 14,
												fontWeight: 700,
											}}
										/>
									</ListItemButton>
									<Collapse
										in={openNest === mainName}
										timeout='auto'
										unmountOnExit
									>
										<List component='div' disablePadding>
											{routes.map(({ icon: ni, name: na, path: np }) => {
												return (
													<ListItemButton
														disableRipple
														disableTouchRipple
														key={np}
														selected={location.includes(np)}
														onClick={() => {
															navigate(np, { replace: true });
														}}
														sx={{
															color: '#1313134F',
															py: 8,
															m: 2,
															ml: 40,
															borderRadius: 8,
															'&.Mui-selected': {
																color: theme.palette.primary.main,
															},
														}}
													>
														<ListItemIcon
															sx={{
																color: 'inherit',
																justifyContent: 'flex-start',
																minWidth: 36,
															}}
														>
															{ni}
														</ListItemIcon>
														<ListItemText
															primary={na}
															primaryTypographyProps={{
																fontSize: 12,
																fontWeight: 700,
															}}
														/>
													</ListItemButton>
												);
											})}
										</List>
									</Collapse>
								</>
							);
						} else {
							return (
								<ListItemButton
									disableRipple
									disableTouchRipple
									key={path}
									selected={location.includes(path)}
									onClick={() => {
										navigate(path, { replace: true });
									}}
									disabled={!active}
									sx={{
										color: '#1313134F',
										m: 4,
										pl: 0,
										borderRadius: 8,
										'&.Mui-selected': {
											backgroundColor: 'transparent',
											color: theme.palette.primary.main,
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
											fontSize: 14,
											fontWeight: 700,
										}}
									/>
								</ListItemButton>
							);
						}
					}
				)}
			</List>
		</Fragment>
	);
};

export default DrawerContent;
