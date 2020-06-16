const express = require("express");
const expressConfig = require("./config/express");
const cors = require("cors")({
  origin: true,
});

// Create the express app and load all middlewares and configurations.
const ioledAPI = express();

// Include passport configuration.
require("./services/passport");

ioledAPI.use(cors);
expressConfig(ioledAPI);

module.exports = ioledAPI;
