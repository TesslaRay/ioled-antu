var express = require("express");
var router = express.Router();

const {
  currentUser,
  getDevices,
  saveDevice,
  deleteDevice,
  // linkUserToDevice,
  // getUserByDevice,
  // getAllDevices,
  // updateDeviceConfig,
} = require("./user_controlles");

// Router middleware to handle auth routes.
router.route("/user/currentUser").post(currentUser);
router.route("/user/devices").post(getDevices);
router.route("/user/saveDevice").post(saveDevice);
router.route("/user/deleteDevice").post(deleteDevice);
// router.route('/linkUser/:userId/:deviceId').put(linkUserToDevice);
// router.route('/device/:id/user').get(getUserByDevice);
// router.route('/allDevices').get(getAllDevices);
// router.route('/changeDevice').post(updateDeviceConfig);

// Export router
module.exports = router;
