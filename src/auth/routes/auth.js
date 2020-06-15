const express = require('express');
const router = express.Router();

// Import all controllers for authentication.
const {authRequest, authCallback} = require('../controllers/auth');
const {signToken} = require('../../middlewares/authService');

// Router middleware to handle auth routes.
router.route('/auth/google').get(authRequest);
router.route('/auth/google/callback').get(authCallback, signToken);

// Export router to use it in the main app.
module.exports = router;
