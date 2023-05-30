const BoardingHouse = require('./../../models/boardingHouse');
const Reservation = require('./../../models/reservation');
const Notification = require('../../models/notification');
const Room = require('./../../models/room');
const User = require('../../models/user');
const { pusher } = require('../../utils');

const landlordCtrl = {
  getUserBH: async (req, res) => {
    try {
      const boardingHouse = await BoardingHouse.findOne({
        owner: req.user.sub,
      }).populate('rooms');

      res.status(200).json({
        boardingHouse,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getLandlordRoomTenants: async (req, res) => {
    try {
      const boardingHouse = await BoardingHouse.findOne({
        owner: req.user.sub,
      });
      const rooms = await Room.find({
        boardingHouse: boardingHouse._id,
      }).populate('tenants');
      const tenants = rooms.map((room) => room.tenants).flat();

      res.status(200).json({
        tenants,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getTenantRequestToLiveReservation: async (req, res) => {
    try {
      const toLiveReservation = await Reservation.find({
        boardingHouseOwner: req.user.sub,
        status: 'pendingToAccept',
      }).populate('tenant');

      const tenants = toLiveReservation
        .map((reservation) => reservation.tenant)
        .flat();

      res.status(200).json({
        tenants,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getTenantRequestToLeaveReservation: async (req, res) => {
    try {
      const toLeaveReservation = await Reservation.find({
        boardingHouseOwner: req.user.sub,
        status: 'pendingToLeave',
      }).populate('tenant');

      const tenants = toLeaveReservation
        .map((reservation) => reservation.tenant)
        .flat();

      res.status(200).json({
        tenants,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getReserved: async (req, res) => {
    try {
      const reserved = await Reservation.find({
        status: 'reserved',
        boardingHouseOwner: req.user.sub,
      })
        .populate('room')
        .populate('tenant');

      res.status(200).json({
        reserved,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getPendingToAccept: async (req, res) => {
    try {
      const pending = await Reservation.find({
        status: 'pendingToAccept',
        boardingHouseOwner: req.user.sub,
      })
        .populate('room')
        .populate('tenant');

      res.status(200).json({
        pending,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getPendingToCancel: async (req, res) => {
    try {
      const pending = await Reservation.find({
        status: 'pendingToLeave',
        boardingHouseOwner: req.user.sub,
      })
        .populate('room')
        .populate('tenant');

      res.status(200).json({
        pending,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  getExpired: async (req, res) => {
    try {
      const expired = await Reservation.find({
        status: 'expired',
      })
        .populate('room')
        .populate('tenant');

      res.status(200).json({
        expired,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  notifyTenant: async (req, res) => {
    try {
      const { tenantId, type, reason } = req.body;
      const user = await User.findById(tenantId).lean();

      const notifType =
        type === 'acceptReservation'
          ? 'Accepted your reservation!'
          : type === 'declineReservation'
          ? 'Declined your reservation!'
          : type === 'acceptCancelation'
          ? 'Accepted your cancelation!'
          : type === 'declineCancelation'
          ? 'Declined your cancelation!'
          : type === 'declineBH'
          ? 'Declined your entry!'
          : null;

      if (!user)
        return res.status(400).json({
          msg: 'User is not found',
        });

      const notifData = {
        user: user._id,
        made: req.user.sub,
        description: notifType,
        reason,
        urlLink: '',
      };

      const newNotif = new Notification(notifData);
      await newNotif.save();

      pusher.trigger('notify', 'notify-tenant', newNotif);
      return res.status(201).json({
        msg: 'Notified!',
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  notifyAdmin: async (req, res) => {
    try {
      const { houseId } = req.body;

      const boardingHouse = await BoardingHouse.findById(houseId);

      const admin = await User.findOne({ role: 'admin' });

      if (!boardingHouse)
        return res.status(400).json({
          msg: 'BoardingHouse',
        });

      const notifData = {
        user: admin?._id,
        made: req.user.sub,
        description: 'New Boarding House',
        urlLink: 'boardingHouse/pending',
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
  createBH: async (req, res) => {
    try {
      const {
        houseName,
        description,
        image,
        landmark,
        nbi,
        accreBIR,
        bp,
        fireCert,
        mp,
        certReg,
        sp,
      } = req.body;

      const existingHouse = await BoardingHouse.findOne({
        houseName: houseName,
      });

      if (existingHouse)
        return res.status(400).json({ msg: 'House name is already taken.' });

      const houseData = {
        houseName,
        landmark,
        description,
        image,
        nbi,
        accreBIR,
        bp,
        fireCert,
        mp,
        certReg,
        sp,
        owner: req.user.sub,
      };

      const newHouse = new BoardingHouse(houseData);

      await newHouse.save();
      pusher.trigger('notify', 'notify-admin', houseData);
      res.status(201).json({
        msg: 'Boarding House created',
        houseId: newHouse._id,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  createRoom: async (req, res) => {
    try {
      const {
        roomType,
        description,
        allowedTenants,
        roomName,
        prize,
        image,
        boardingHouseId,
      } = req.body;

      const roomData = {
        roomType,
        roomName,
        description,
        allowedTenants,
        prize,
        image,
        boardingHouse: boardingHouseId,
      };

      const newRoom = new Room(roomData);

      const savedRoom = await newRoom.save();
      res.status(201).json({
        roomId: savedRoom._id,
        msg: 'Uploading room',
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .json({ msg: Object.values(err.errors).map((val) => val.message) });
      }
      res.status(400).json({ msg: error.message });
    }
  },
  updateBH: async (req, res) => {
    try {
      const {
        houseName,
        description,
        image,
        landmark,
        nbi,
        accreBIR,
        bp,
        fireCert,
        mp,
        certReg,
        sp,
      } = req.body;

      const houseData = {
        houseName,
        landmark,
        description,
        image,
        nbi,
        accreBIR,
        bp,
        fireCert,
        mp,
        certReg,
        sp,
        owner: req.user.sub,
      };

      await BoardingHouse.findByIdAndUpdate(req.params.id, houseData, {
        new: true,
      });
      res.status(200).json({
        msg: 'Boarding House updated',
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  acceptReservation: async (req, res) => {
    try {
      const { tenantID, roomId } = req.body;
      const reservation = await Reservation.findById(req.params.id);

      const tenantExistInRoom = await Room.findOne({
        _id: roomId,
        tenants: tenantID,
      });

      if (tenantExistInRoom)
        return res
          .status(400)
          .json({ msg: 'Tenant has already a reservation' });

      if (!reservation)
        return res.status(400).json({ msg: 'No reservation found!' });

      if (reservation) {
        const allowedTntEqualTnts = await Room.findById(roomId);

        if (
          allowedTntEqualTnts.allowedTenants ===
          allowedTntEqualTnts.tenants.length
        )
          return res.status(400).json({ msg: 'Room already full' });

        const reserved = await Reservation.findByIdAndUpdate(
          req.params.id,
          { status: 'reserved' },
          { new: true }
        );

        if (!reserved)
          return res.status(400).json({ msg: 'Cannot find Reservation' });

        const updateUser = await User.findByIdAndUpdate(
          tenantID,
          { noBH: false, status: 'living' },
          { new: true }
        );

        if (updateUser) {
          await Room.findByIdAndUpdate(
            roomId,
            {
              $push: { tenants: tenantID },
              available: false,
            },
            { new: true }
          );
          return res.status(200).json({
            msg: 'Reservation accepted!',
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  acceptLeaveBH: async (req, res) => {
    try {
      const { tenantID, roomId } = req.body;

      const reservation = await Reservation.findById(req.params.id);

      if (!reservation)
        return res.status(400).json({ msg: 'No reservation found!' });

      const roomUpdated = await Room.findByIdAndUpdate(
        roomId,
        {
          $pull: { tenants: tenantID },
        },
        { new: true }
      );

      const reserved = await Reservation.findByIdAndUpdate(
        req.params.id,
        { status: 'canceled' },
        { new: true }
      );

      const updatedUser = await User.findByIdAndUpdate(
        tenantID,
        { status: 'new', noBH: true, reviewed: false },
        { new: true }
      );

      if (!reserved && !updatedUser)
        return res.status(400).json({ msg: 'Cannot find Reservation' });

      if (roomUpdated && reserved && updatedUser) {
        return res.status(200).json({
          msg: 'Reservation canceled!',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  declineReservation: async (req, res) => {
    try {
      const { tenantID } = req.body;
      const reservation = await Reservation.findById(req.params.id);

      if (!reservation)
        return res.status(400).json({ msg: 'No reservation found!' });

      const reserved = await Reservation.findByIdAndUpdate(
        req.params.id,
        { status: 'declined' },
        { new: true }
      );

      if (!reserved)
        return res.status(400).json({ msg: 'Cannot find Reservation' });

      if (reserved) {
        await User.findByIdAndUpdate(
          tenantID,
          { status: 'new' },
          { new: true }
        );
      }
      pusher.trigger('notify', 'notify-tenant', reserved);
      return res.status(200).json({
        msg: 'Reservation rejected!',
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  declineLeaveBH: async (req, res) => {
    try {
      const { tenantID } = req.body;
      const reservation = await Reservation.findById(req.params.id);

      if (!reservation)
        return res.status(400).json({ msg: 'No reservation found!' });

      const reserved = await Reservation.findByIdAndUpdate(
        req.params.id,
        { status: 'reserved' },
        { new: true }
      );

      if (!reserved)
        return res.status(400).json({ msg: 'Cannot find Reservation' });

      await User.findByIdAndUpdate(
        tenantID,
        { status: 'living' },
        { new: true }
      );

      pusher.trigger('notify', 'notify-tenant', reserved);
      return res.status(200).json({
        msg: 'Declined Cancelation!',
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Something went wrong!' });
    }
  },
  insertRoomToBH: async (req, res) => {
    try {
      const room = await Room.findOne({ _id: req.params.id });
      if (room) {
        await BoardingHouse.findOneAndUpdate(
          {
            _id: room.boardingHouse,
          },
          { $push: { rooms: req.params.id } },
          { new: true }
        );
      }

      return res.status(200).json({ msg: 'Room created' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  removeRoomToBH: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);

      const roomIsOccupied = room.tenants.length > 0 ? true : false;

      if (roomIsOccupied) {
        return res.status(400).json({
          msg: 'Room is occupied',
        });
      }

      if (!roomIsOccupied) {
        await BoardingHouse.findOneAndUpdate(
          {
            _id: room.boardingHouse,
          },
          { $pull: { rooms: req.params.id } },
          { new: true }
        );
        return res.status(200).json({
          msg: 'Room removed',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  removeTenantToRoom: async (req, res) => {
    try {
      const room = await Room.findOne({ tenants: req.params.id });

      const expiredReservation = await Reservation.findOne({
        room: room?._id,
        tenant: req.params.id,
        status: 'expired',
      });

      if (expiredReservation) {
        await Room.findByIdAndUpdate(
          room?._id,
          { $pull: { tenants: req.params.id } },
          { new: true }
        );
      }
      return res.status(200).json({ msg: 'Tenant Removed from the Room!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  updateRoom: async (req, res) => {
    try {
      const {
        roomType,
        roomName,
        description,
        allowedTenants,
        prize,
        image,
        boardingHouseId,
      } = req.body;

      const roomData = {
        roomType,
        roomName,
        description,
        allowedTenants,
        prize,
        image,
        boardingHouse: boardingHouseId,
      };

      await Room.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        roomData,
        { new: true }
      );
      res.status(200).json({
        msg: 'Room updated',
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  deleteRoom: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);

      const roomIsOccupied = room.tenants.length > 0 ? true : false;

      if (roomIsOccupied)
        return res.status(400).json({ msg: 'Room Occupied!' });

      await Room.findOneAndDelete({
        _id: req.params.id,
      });

      return res.status(200).json({ msg: 'Room Deleted!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  deleteNotifLandlord: async (req, res) => {
    try {
      console.log(req.user.sub);
      console.log(req.params.id);
      const user = await User.findById(req.user.sub);

      if (!user) return res.status(400).json({ msg: 'User not found!' });

      // const notif = await Notification.findOne({
      //   _id: req.params.id,
      // });

      // if (!notif) res.status(400).json({ msg: 'Cannot find Notification!' });

      await Notification.findOneAndDelete({
        _id: req.params.id,
      });

      // if (!notifDeleted) {
      //   res.status(400).json({ msg: 'Cannot find Notification!' });
      // } else {
      pusher.trigger('notify', 'notify-tenant', user);
      return res.status(200).json({});
      // }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = landlordCtrl;
