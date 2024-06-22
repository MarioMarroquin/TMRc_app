export default function titleCaseClean(str) {
	return str
		.split(' ')
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim();
}
