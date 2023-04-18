const express = require('express');
const userCtrl = require('./../controllers/user');
const {
  checkJwt,
  attachUser,
  requireAuthenticated,
} = require('../middlewares/userIdentification');
const router = express.Router();

router.get(
  '/boardinghouse/approved',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.getApprovedBH
);
router.get(
  '/boardinghouse/approved/:id',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.getOneApprovedBH
);
router.get(
  '/room/:id',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.getOneRoom
);
router.get(
  '/room/tenant/living',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.getTenantRoom
);
router.get(
  '/reviews/room/:id',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.getRoomReviews
);
router.get(
  '/reviews/boardingHouse/:id',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.getBoardingHouseReviews
);
router.get(
  '/user/living',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.getUserUpdatedToLiving
);
router.get(
  '/user/new',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.getUserUpdatedToNew
);
router.get(
  '/notify',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.getNotif
);
router.post(
  '/notify/landlord',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.notifyLandlord
);
router.post(
  '/reserve',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.reserveRoom
);
router.post(
  '/reviews',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.review
);
router.patch(
  '/reservation/expire',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.expiredReservation
);
router.patch(
  '/room/user/reserved-request',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.requestedRoom
);
router.patch(
  '/room/user/leave-request',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.requestToLeaveRoom
);
router.patch(
  '/reservation/leave',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.leaveTheBHRequest
);
router.patch(
  '/reservation/cancel-request',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.cancelRequestedRoom
);
router.patch(
  '/user/update',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.updateUserAsReviewed
);
router.delete(
  '/reservation/cancel/:id',
  attachUser,
  checkJwt,
  requireAuthenticated,
  userCtrl.cancelReservation
);

module.exports = router;