var express = require('express');
var router = express.Router();

const {
  currentUser,
  getDevices,
  // saveDevice,
  // linkUserToDevice,
  // getUserByDevice,
  // getAllDevices,
  // updateDeviceConfig,
} = require('../controllers/user');

// Router middleware to handle auth routes.
router.route('/user/currentUser').post(currentUser);
router.route('/user/devices').post(getDevices);
// router.route('/saveDevice').post(saveDevice);
// router.route('/linkUser/:userId/:deviceId').put(linkUserToDevice);
// router.route('/device/:id/user').get(getUserByDevice);
// router.route('/allDevices').get(getAllDevices);
// router.route('/changeDevice').post(updateDeviceConfig);

// Export router
module.exports = router;
