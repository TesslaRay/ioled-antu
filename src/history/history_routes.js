var express = require('express');
var router = express.Router();

// Import all controllers for history

const {getDayGraph, getWeekGraph, getMonthGraph} = require('./history_controller');

// Router middleware to handle auth routes.
router.route('/history/day/:id').get(getDayGraph);
router.route('/history/week/:id').get(getWeekGraph);
router.route('/history/month/:id').get(getMonthGraph);

// Export router
module.exports = router;
