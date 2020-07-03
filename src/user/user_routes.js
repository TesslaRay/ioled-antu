var express = require("express");
var router = express.Router();

const {
  currentUser,
  getDevices,
  saveDevice,
  deleteDevice,
} = require("./user_controlles");

// Router middleware to handle auth routes.
router.route("/user/currentUser").post(currentUser);
router.route("/user/devices").post(getDevices);
router.route("/user/saveDevice").post(saveDevice);
router.route("/user/deleteDevice").post(deleteDevice);

// Export router
module.exports = router;
