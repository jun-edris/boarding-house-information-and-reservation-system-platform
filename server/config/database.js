const mongoose = require('mongoose');

const URI = process.env.MONGODB_URL;

mongoose.set('strictQuery', true);

mongoose
	.connect(`${URI}`, {
		autoIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.catch((err) => {
		console.log(err.message);
	});
