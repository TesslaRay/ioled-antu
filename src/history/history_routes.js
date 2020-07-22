var express = require('express');
var router = express.Router();

// Import all controllers for history

const {getDayGraph, getWeekGraph, getMonthGraph} = require('./history_controller');

// Router middleware to handle auth routes.
router.route('/history/day/:id').get(getDayGraph);

// Export router
module.exports = router;
