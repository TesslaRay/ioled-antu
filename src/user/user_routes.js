var express = require('express');
var router = express.Router();

const {
  currentUser,
  getDevices,
  saveDevice,
  deleteDevice,
  changeDevice,
} = require('./user_controlles');

// Router middleware to handle auth routes.
router.route('/user/currentUser').get(currentUser);
router.route('/user/devices').get(getDevices);
router.route('/user/saveDevice').post(saveDevice);
router.route('/user/deleteDevice').post(deleteDevice);
router.route('/user/changeDevice').post(changeDevice);
// Export router
module.exports = router;
