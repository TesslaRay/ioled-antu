const express = require("express");
const router = express.Router();

// Import all controllers for devices control
const {
  getDeviceState,
  getDeviceConfig,
  updateDeviceConfig,
  getDeviceLastConfig,
  getDeviceLastState,
  updateGroupConfig,
  getGroupLastState,
  saveDevice,
} = require("../controllers/device-control");

// Router middleware to handle devices routes.
router.route("/device/saveDevice").post(saveDevice);

router.route("/device/:id/state").get(getDeviceLastState);

// router.route('/device/:id/config').get(getDeviceLastConfig);

// router.route('/device/:id').put(updateDeviceConfig);

router.route("/device/:id/state-history").get(getDeviceState);

// router.route('/device/:id/config-history').get(getDeviceConfig);

// router.route('/group/config').put(updateGroupConfig);

// router.route('/group/state').put(getGroupLastState);
// Export router to use it in the main router.
module.exports = router;
