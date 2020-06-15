const express = require('express');
const expressConfig = require('./config/express');
const cors = require('cors')({
  origin: true,
});

// Create the express app and load all middlewares and configurations.
const ioledAPI = express();

ioledAPI.use(cors);
expressConfig(ioledAPI);

// Include passport configuration.
require('./services/passport');

const PORT = process.env.PORT;

if (PORT === undefined) {
  console.log('[iOLED-API][Error] No port specified in the env variables');
  process.exit(1);
}

ioledAPI.listen(PORT, () => {
  console.log('[iOLED-API] Listening on port', PORT);
});
