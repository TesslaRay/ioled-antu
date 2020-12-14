const express = require('express');
const app = express();

// ----- Import all routes here -----
const authRoute = require('./auth/auth_routes');
const userRoute = require('./user/user_routes');
const devicesRoute = require('./device-control/device-control_routes');
const historyRoute = require('./history/history_routes');

// ----- Use all routes here -----
app.use(authRoute);
app.use(userRoute);
app.use(devicesRoute);
app.use(historyRoute);

// Export main router to use it in the main app.
module.exports = app;
