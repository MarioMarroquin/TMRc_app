import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

const CustomBreadcrumbs = () => {
	const navigate = useNavigate();
	const location = useLocation().pathname;
	const route = location.split('/').filter((x) => x);

	const searchName = (value, index, list) => {
		const res = routes.find(({ path }) => path === `/${value}`);

		if (!res) return '';
		return res.name;
	};

	return (
		<Breadcrumbs>
			{route.map((value, index) => {
				const last = index === route.length - 1;
				const to = `/${route.slice(0, index + 1).join('/')}`;

				return last ? (
					<Typography color='text.primary' key={value}>
						{searchName(value, index, route)}
					</Typography>
				) : (
					<Link
						underline='hover'
						color='inherit'
						onClick={() => {
							navigate(to);
						}}
						key={value}
					>
						{searchName(value, index, route)}
					</Link>
				);
			})}
		</Breadcrumbs>
	);
};

export default CustomBreadcrumbs;
