import { format, getDate, getMonth, getYear } from 'date-fns';

const formatToFolio = (params) => {
	const year = getYear(new Date(params));
	const month = getMonth(new Date(params)) + 1;
	const day = getDate(new Date(params));

	const aux = format(new Date(params), 'HHmmss');
	return `${year}${month}${day}${aux}`.slice(2);
};

export default formatToFolio;
