import urlJoin from 'url-join';

const authUrl = urlJoin(process.env.REACT_APP_API_URL, 'auth');
const apiUrl = urlJoin(process.env.REACT_APP_API_URL, 'graphql');
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const logRocketApiKey = process.env.REACT_APP_LOG_ROCKET_API_KEY;

export { authUrl, apiUrl, googleMapsApiKey, firebaseConfig, logRocketApiKey };
