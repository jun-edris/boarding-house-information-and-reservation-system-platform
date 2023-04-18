const express = require('express');
const authCtrl = require('../controllers/auth/index');
const router = express.Router();

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.get('/logout', authCtrl.logout);

module.exports = router;
