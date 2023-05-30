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
  // notify: async (req, res) => {
  //   try {
  //     const { tenantId, type, reason } = req.body;
  //     const user = await User.findById(tenantId).lean();

  //     const notifType =
  //       type === 'acceptReservation'
  //         ? 'Accepted your reservation!'
  //         : type === 'declineReservation'
  //         ? 'Declined your reservation!'
  //         : type === 'acceptCancelation'
  //         ? 'Accepted your cancelation!'
  //         : type === 'declineCancelation'
  //         ? 'Declined your cancelation!'
  //         : type === 'declineBH'
  //         ? 'Declined your entry!'
  //         : null;

  //     if (!user)
  //       return res.status(400).json({
  //         msg: 'User is not found',
  //       });

  //     const notifData = {
  //       user: user._id,
  //       made: req.user.sub,
  //       description: notifType,
  //       reason,
  //       urlLink: '',
  //     };

  //     const newNotif = new Notification(notifData);
  //     await newNotif.save();

  //     pusher.trigger('notify', 'notify-landlord', newNotif);
  //     return res.status(201).json({
  //       msg: 'Notified!',
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).json({ msg: 'Something went wrong!' });
  //   }
  // },
  declineBH: async (req, res) => {
    try {
      const boardingHouse = await BoardingHouse.findById(req.params.id);

      if (boardingHouse) {
        await BoardingHouse.findOneAndDelete({
          _id: req.params.id,
        });

        return res.status(200).json({ msg: 'Boarding House Deleted!' });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = adminCtrl;
