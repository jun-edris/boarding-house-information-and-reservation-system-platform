import { Cloudinary } from '@cloudinary/url-gen';

const cloud = new Cloudinary({
	cloud: {
		cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
	},
	url: {
		secure: true,
	},
});

export default cloud;
