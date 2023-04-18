const BoardingHouse = require('../../models/boardingHouse');
const User = require('../../models/user');

const adminCtrl = {
	getLandlordCount: async (req, res) => {
		try {
			const landlordCount = await User.countDocuments({
				role: 'landlord',
			});
			res.status(200).json(landlordCount);
		} catch (error) {
			console.log(error);
			res.status(400).json({ msg: 'Something went wrong!' });
		}
	},
	getTenantCount: async (req, res) => {
		try {
			const tenantCount = await User.countDocuments({
				role: 'tenant',
			});
			res.status(200).json(tenantCount);
		} catch (error) {
			console.log(error);
			res.status(400).json({ msg: 'Something went wrong!' });
		}
	},
	getPendingBHCount: async (req, res) => {
		try {
			const pending = await BoardingHouse.countDocuments({
				approved: false,
			});
			res.status(200).json(pending);
		} catch (error) {
			console.log(error);
			res.status(400).json({ msg: 'Something went wrong!' });
		}
	},
	getApprovedBHCount: async (req, res) => {
		try {
			const approved = await BoardingHouse.countDocuments({
				approved: true,
			});
			res.status(200).json(approved);
		} catch (error) {
			console.log(error);
			res.status(400).json({ msg: 'Something went wrong!' });
		}
	},
	getAllLandlord: async (req, res) => {
		try {
			const user = await User.find({
				role: 'landlord',
			});
			res.status(200).json(user);
		} catch (error) {
			console.log(error);
			res.status(400).json({ msg: 'Something went wrong!' });
		}
	},
	getAllTenant: async (req, res) => {
		try {
			const user = await User.find({
				role: 'tenant',
			});

			res.status(200).json(user);
		} catch (error) {
			console.log(error);
			res.status(400).json({ msg: 'Something went wrong!' });
		}
	},
	getPendingBH: async (req, res) => {
		try {
			// console.log('hello');
			const boardingHouse = await BoardingHouse.find({
				approved: false,
			}).populate('owner');

			res.status(200).json(boardingHouse);
		} catch (error) {
			console.log(error);
			res.status(400).json({ msg: 'Something went wrong!' });
		}
	},
	getApprovedBH: async (req, res) => {
		try {
			const boardingHouse = await BoardingHouse.find({
				approved: true,
			}).populate('owner');

			res.status(200).json(boardingHouse);
		} catch (error) {
			console.log(error);
			res.status(400).json({ msg: 'Something went wrong!' });
		}
	},
	approveBH: async (req, res) => {
		try {
			const { id } = req.body;
			const boardingHouse = await BoardingHouse.findByIdAndUpdate(
				id,
				{
					approved: true,
				},
				{
					new: true,
				}
			);

			res.status(200).json(boardingHouse);
		} catch (error) {
			console.log(error);
			res.status(400).json({ msg: 'Something went wrong!' });
		}
	},
};

module.exports = adminCtrl;
