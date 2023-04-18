import axios from 'axios';

const baseURL =
	process.env.NODE_ENV === 'production'
		? process.env.REACT_APP_API_URL
		: '/api';

const publicFetch = axios.create({
	baseURL: baseURL,
});

export { publicFetch, baseURL };
