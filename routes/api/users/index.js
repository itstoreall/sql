const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/users.js');
const guard = require('../../../helpers/guard');
const { validateUserSignup, validateUserLogin } = require('./validation');

router.post('/signup', validateUserSignup, ctrl.reg); // return jwt-token
router.post('/login', validateUserLogin, ctrl.login);
router.post('/logout', guard, ctrl.logout); // Logout only through guard
router.get('/current', guard, ctrl.current);
router.patch('/', guard, ctrl.updateSubscription);

module.exports = router;
