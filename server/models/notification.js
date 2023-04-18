const mongoose = require('mongoose');

const notifSchema = mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
		made: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
		description: {
			type: String,
		},
		urlLink: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Notifications', notifSchema);
