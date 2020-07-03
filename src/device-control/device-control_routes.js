const express = require('express');
const router = express.Router();

// Import all controllers for devices control
const {
  getDeviceState,
  getDeviceLastState,
  updateDeviceConfig,
  updateGroupConfig,
  getGroupLastState,
  saveDevice,
} = require('./device-control_controllers');

// Router middleware to handle devices routes.
router.route('/device/:id/state-history').get(getDeviceState);
router.route('/device/:id/state').get(getDeviceLastState);
router.route('/device/:id').put(updateDeviceConfig);

// router.route('/group/config').put(updateGroupConfig);
// router.route('/group/state').put(getGroupLastState);

// Export router to use it in the main router.
module.exports = router;
