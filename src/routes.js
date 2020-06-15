const express = require('express');
const app = express();

// ----- Import all routes here -----
const authRoute = require('./auth/routes/auth');
const userRoute = require('./user/routes/user');
const devicesRoute = require('./device-control/routes/device-control');

// ----- Use all routes here -----
app.use(authRoute);
app.use(userRoute);
app.use(devicesRoute);

// Export main router to use it in the main app.
module.exports = app;
