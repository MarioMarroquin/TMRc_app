import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import routes from '../../routes';

const CustomBreadcrumbs = () => {
	const location = useLocation().pathname;
	const route = location.split('/').filter((x) => x);

	const searchName = (value) => {
		const res = routes.find(({ path }) => path === `/${value}`);

		return res.name;
	};

	return (
		<Breadcrumbs>
			{route.map((value, index) => {
				const last = index === route.length - 1;
				const to = `/${route.slice(0, index + 1).join('/')}`;

				return last ? (
					<Typography color='text.primary' key={value}>
						{searchName(value)}
					</Typography>
				) : (
					<Link underline='hover' color='inherit' href={to} key={value}>
						{searchName(value)}
					</Link>
				);
			})}
		</Breadcrumbs>
	);
};

export default CustomBreadcrumbs;
