const express = require('express');
const adminCtrl = require('./../controllers/admin');
const {
  checkJwt,
  attachUser,
  requireAuthorized,
} = require('../middlewares/userIdentification');
const router = express.Router();

router.get(
  '/user/landlord/count',
  attachUser,
  checkJwt,
  requireAuthorized,
  adminCtrl.getLandlordCount
);
router.get(
  '/user/tenant/count',
  attachUser,
  checkJwt,
  requireAuthorized,
  adminCtrl.getTenantCount
);
router.get(
  '/boardinghouse/pending/count',
  attachUser,
  checkJwt,
  requireAuthorized,
  adminCtrl.getPendingBHCount
);
router.get(
  '/boardinghouse/approved/count',
  attachUser,
  checkJwt,
  requireAuthorized,
  adminCtrl.getApprovedBHCount
);
router.get(
  '/user/tenant',
  attachUser,
  checkJwt,
  requireAuthorized,
  adminCtrl.getAllTenant
);
router.get(
  '/user/landlord',
  attachUser,
  checkJwt,
  requireAuthorized,
  adminCtrl.getAllLandlord
);
router.get(
  '/boardinghouse/not/approved',
  attachUser,
  checkJwt,
  requireAuthorized,
  adminCtrl.getPendingBH
);
router.get(
  '/boardinghouse/approved',
  attachUser,
  checkJwt,
  requireAuthorized,
  adminCtrl.getApprovedBH
);
router.patch(
  '/boardinghouse',
  attachUser,
  checkJwt,
  requireAuthorized,
  adminCtrl.approveBH
);
router.delete(
  '/boardinghouse/decline/:id',
  attachUser,
  checkJwt,
  requireAuthorized,
  adminCtrl.declineBH
);

module.exports = router;
