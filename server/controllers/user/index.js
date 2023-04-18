const BoardingHouse = require('../../models/boardingHouse');
const Reservation = require('../../models/reservation');
const User = require('../../models/user');
const Room = require('./../../models/room');
const { pusher } = require('../../utils');
const Notification = require('../../models/notification');
const Review = require('../../models/reviews');
const userCtrl = {
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
  getOneApprovedBH: async (req, res) => {
    try {
      const boardingHouse = await BoardingHouse.findOne({
        _id: req.params.id,
        approved: true,
      })
        .populate('owner')
        .populate('rooms');

      res.status(200).json(boardingHouse);
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getRoomReviews: async (req, res) => {
    try {
      const reviews = await Review.find({
        room: req.params.id,
      }).populate('tenant');

      res.status(200).json({
        reviews,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getBoardingHouseReviews: async (req, res) => {
    try {
      const reviews = await Review.find({
        boardingHouse: req.params.id,
      })
        .populate('tenant')
        .populate('room');

      res.status(200).json({
        reviews,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getOneRoom: async (req, res) => {
    try {
      const room = await Room.findOne({
        owner: req.params.id,
      });

      res.status(200).json({
        room,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getUserUpdatedToLiving: async (req, res) => {
    try {
      const userToLive = await User.findOne({
        _id: req.user.sub,
        status: 'living',
      });

      if (!userToLive) return res.status(400).json({ msg: 'Cannot find user' });

      res.status(200).json({
        user: userToLive,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getUserUpdatedToNew: async (req, res) => {
    try {
      const userToLive = await User.findOne({
        _id: req.user.sub,
        status: 'new',
      });

      if (!userToLive) return res.status(400).json({ msg: 'Cannot find user' });

      res.status(200).json({
        user: userToLive,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getTenantRoom: async (req, res) => {
    try {
      const room = await Room.findOne({
        tenants: req.user.sub,
      })
        .populate('tenants')
        .populate('boardingHouse');

      const owner = await User.findById(room.boardingHouse.owner);

      const reservation = await Reservation.findOne({ tenant: req.user.sub });
      res.status(200).json({
        room,
        owner: owner,
        reservation,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getNotif: async (req, res) => {
    try {
      const notif = await Notification.find({
        user: req.user.sub,
      })
        .populate('made')
        .populate('user');

      return res.status(200).json({
        notif,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  notifyLandlord: async (req, res) => {
    try {
      const { roomId, type } = req.body;

      const boardingHouse = await BoardingHouse.findOne({ rooms: roomId });

      const notifType =
        type === 'toReserve'
          ? `Requested for reservation`
          : type === 'toCancel'
          ? `Requested for cancelation!`
          : type === 'toLeave'
          ? `Leave Request!`
          : null;

      if (!boardingHouse)
        return res.status(400).json({
          msg: 'Room is not found in the boarding house',
        });

      const notifData = {
        user: boardingHouse?.owner,
        made: req.user.sub,
        description: notifType,
        urlLink: 'reservation/pending',
      };

      const newNotif = new Notification(notifData);
      await newNotif.save();

      pusher.trigger('notify', 'notify-landlord', newNotif);
      return res.status(201).json({
        msg: 'Notified!',
        notif: newNotif,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  review: async (req, res) => {
    try {
      const { boardingHouse, room, rating, description } = req.body;

      const existingRoom = await Room.findById(room);
      const existingBoardingHouse = await BoardingHouse.findById(boardingHouse);
      const existingUser = await User.findById(req.user.sub);

      if (!existingRoom)
        return res.status(400).json({ msg: "Room doesn't exist" });

      if (!existingBoardingHouse)
        return res.status(400).json({ msg: "Boarding house doesn't exist" });

      if (!existingUser)
        return res.status(400).json({ msg: "User doesn't exist" });

      const reviewData = {
        boardingHouse,
        room,
        tenant: req.user.sub,
        rating,
        description,
      };

      const newReservation = new Review(reviewData);
      await newReservation.save();

      return res.status(201).json({ msg: 'Reviewed!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  reserveRoom: async (req, res) => {
    try {
      const { roomId, dateToLive, dateToLeave } = req.body;

      const room = await Room.findById(roomId);

      const boardingHouse = await BoardingHouse.findOne({ rooms: roomId });
      if (!room)
        return res.status(400).json({
          msg: 'No room found',
        });

      if (room.allowedTenants === 0)
        return res.status(400).json({
          msg: 'Room already in full!',
        });

      const reservationData = {
        room: roomId,
        dateToLive,
        dateToLeave,
        boardingHouseOwner: boardingHouse?.owner,
        tenant: req.user.sub,
      };

      const newReservation = new Reservation(reservationData);
      await newReservation.save();

      pusher.trigger('reserve', 'reserve', newReservation);
      return res.status(201).json({
        msg: 'Reserved!',
        reservation: newReservation,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  requestedRoom: async (req, res) => {
    try {
      // check if the allowed Tenants is equal to the number or tenants
      const { room } = req.body;
      const user = await User.findById(req.user.sub);
      if (user) {
        const updatedUser = await User.findByIdAndUpdate(
          req.user.sub,
          { status: 'requestedToReserve', room },
          { new: true }
        );

        if (!updatedUser)
          return res.status(400).json({ msg: 'Cannot update User!' });
        // pusher.trigger('reserve', 'request-room', updatedUser);

        const updatedUserProfile = await User.findById(req.user.sub).lean();
        return res.status(200).json({
          msg: 'Success',
          user: updatedUserProfile,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  requestToLeaveRoom: async (req, res) => {
    try {
      const user = await User.findById(req.user.sub);
      if (user) {
        const updatedUser = await User.findByIdAndUpdate(
          req.user.sub,
          { status: 'requestedToLeave' },
          { new: true }
        );

        const updatedUserProfile = await User.findById(req.user.sub).lean();

        if (!updatedUser)
          return res.status(400).json({ msg: 'Cannot update User!' });

        if (updatedUser) {
          return res.status(200).json({
            user: updatedUserProfile,
            msg: 'Success',
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  updateUserAsReviewed: async (req, res) => {
    try {
      const user = await User.findById(req.user.sub);
      if (user) {
        const updatedUser = await User.findByIdAndUpdate(
          req.user.sub,
          { reviewed: true },
          { new: true }
        );

        const updatedUserProfile = await User.findById(req.user.sub).lean();

        if (!updatedUser)
          return res.status(400).json({ msg: 'Cannot update User!' });

        if (updatedUser) {
          return res.status(200).json({
            user: updatedUserProfile,
            msg: 'Success',
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  leaveTheBHRequest: async (req, res) => {
    try {
      const { room, tenant } = req.body;

      const existingRoom = await Room.findById(room);

      const boardingHouse = await BoardingHouse.findOne({ rooms: room });
      if (!existingRoom && !boardingHouse)
        return res.status(400).json({
          msg: 'No room found',
        });

      const leaveBH = await Reservation.findOneAndUpdate(
        { room: room, tenant: tenant },
        { status: 'pendingToLeave' },
        { new: true }
      );

      pusher.trigger('reservation', 'toLeave', leaveBH);
      return res.status(201).json({
        msg: 'Requested To Leave!',
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  notifRead: async (req, res) => {
    try {
      // check if the allowed Tenants is equal to the number or tenants
      const notif = await Notification.findById(req.params.id);

      if (!notif)
        return res.status(400).json({ msg: 'No notification found!' });

      const readNotif = await Notification.findByIdAndUpdate(req.params.id, {
        new: false,
      });

      pusher.trigger('notify', 'notify-landlord', readNotif);

      return res.status(200).json({
        msg: 'Notification read!',
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  cancelRequestedRoom: async (req, res) => {
    try {
      // check if the allowed Tenants is equal to the number or tenants

      const user = await User.findById(req.user.sub);
      if (user) {
        const updatedUser = await User.findByIdAndUpdate(
          req.user.sub,
          { status: 'new' },
          { new: true }
        );

        if (!updatedUser)
          return res.status(400).json({ msg: 'Cannot update User!' });
        pusher.trigger('notify', 'notify-landlord', updatedUser);

        if (updatedUser) {
          const updatedUserProfile = await User.findById(req.user.sub).lean();

          return res.status(200).json({
            msg: 'Success',
            user: updatedUserProfile,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  expiredReservation: async (req, res) => {
    try {
      const today = new Date().toISOString();

      const expiredReservation = await Reservation.find({
        dateToLeave: { $lte: today },
      });

      const usersOfExpiredReservation = expiredReservation.map(
        (user) => user._id
      );

      if (expiredReservation.length === 0)
        return res.status(400).json({ msg: 'No reservation is expired!' });

      if (expiredReservation.length > 0) {
        const updateReservation = await Reservation.updateMany(
          { dateToLeave: { $lte: today } },
          { status: 'expired' },
          { new: true }
        );

        if (updateReservation) {
          await User.updateMany(
            { _id: { $in: usersOfExpiredReservation } },
            { $set: { status: 'new', noBH: true, reviewed: false } }
          );
        }

        pusher.trigger('reserve', 'expired', updateReservation);
        return res.status(200).json({ msg: 'Some reservations are expired!' });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  availableRoom: async (req, res) => {
    try {
      // check if the allowed Tenants is equal to the number or tenants
      const allowedTntEqualTnts = await Room.findById(req.params.id);

      if (allowedTntEqualTnts.tenants.length !== 0)
        return res.status(200).json({ msg: 'Room is occupied!' });

      if (allowedTntEqualTnts.tenants.length === 0) {
        await Room.findByIdAndUpdate(
          req.params.id,
          {
            occupied: false,
          },
          { new: true }
        );

        res.status(200).json({
          msg: 'Success',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  cancelReservation: async (req, res) => {
    try {
      const reservation = await Reservation.findOne({ tenant: req.user.sub });

      if (!reservation)
        return res.status(400).json({ msg: 'No reservation found!' });

      const cancelReservation = await Reservation.findOne({
        tenant: req.user.sub,
        room: req.params.id,
      });

      if (cancelReservation) {
        await Reservation.findOneAndDelete({
          tenant: req.user.sub,
          room: req.params.id,
          status: 'pendingToAccept',
        });
        await Notification.findOneAndDelete({ made: req.user.sub });

        return res.status(200).json({
          msg: 'Reservation canceled!',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
};

module.exports = userCtrl;
