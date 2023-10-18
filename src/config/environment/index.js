import urlJoin from 'url-join';

const authUrl = urlJoin(process.env.REACT_APP_API_URL, 'auth');
const apiUrl = urlJoin(process.env.REACT_APP_API_URL, 'graphql');
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export { authUrl, apiUrl, googleMapsApiKey };
