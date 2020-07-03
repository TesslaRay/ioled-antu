const {getUser, getDevices, addDevice, deleteDevice} = require('../services/firestore');

/**
 * @CristianValdivia
 * Returns the current authenticated user.
 * @param {{user: object}} req googleID
 * @param {object} res Response.
 */
exports.currentUser = async (req, res) => {
  console.log('[iOLED-API][user][currentUser][Request] ', req.body);
  const {user} = req.body;
  const googleID = user;

  // If user is not authenticated, return null.
  if (!googleID) {
    console.log('[iOLED-API][user][currentUser][Error]', {
      error: 'User not logged in',
    });
    res.status(500).json({error: 'User not logged in'});
  } else {
    try {
      // Search in the DB for the user.
      const {user: userInfo} = await getUser(googleID);

      console.log('[iOLED-API][user][currentUser][Response]', userInfo);
      res.status(200).send({currentUser: userInfo});
    } catch (err) {
      console.log('[iOLED-API][user][currentUser][Error]', err);
      res.status(500).json(err);
    }
  }
};

/**
 * @CristianValdivia
 * List all the registered devices for the current user.
 * @description List the devices registered in the user database.
 * @param {{user: object}} req googleID
 * @param {object} res Response.
 */
exports.getDevices = async (req, res) => {
  console.log('[iOLED-API][user][getDevices][Request]'), req.body;
  const {user} = req.body;
  const googleID = user;

  // If user is not authenticated, return null.
  if (!googleID) {
    console.log('[iOLED-API][user][getDevices][Error]', {
      error: 'User not logged in',
    });
    res.status(500).json({error: 'User not logged in'});
  } else {
    try {
      // Search in the DB for the devices.
      const devices = await getDevices(googleID);

      console.log('[iOLED-API][user][getDevices][Response]', devices);
      res.status(200).send({userDevices: devices});
    } catch (error) {
      console.log('[iOLED-API][user][getDevices][Error]', error);
      res.status(500).json(error);
    }
  }
};

/**
 * @DiegoSepulveda
 * Save a new device in the firestore database with default config
 * @description Save new device in the database
 * @param {{body: {user: string, deviceID: string}}} req Request.
 * @param {object} res Response.
 */
exports.saveDevice = async (req, res) => {
  console.log('[iOLED-API][user][saveDevice][Request]', req.params, req.body);
  const {user, deviceID, power} = req.body;

  const device = {
    alias: deviceID,
    duty: 1,
    state: true,
    timerOn: '00:00',
    timerOff: '00:00',
    timerState: false,
    user,
    deviceID,
    power,
  };

  try {
    const ref = await addDevice(device);
    console.log('[iOLED-API][user][saveDevice][Response]', {
      newDevice: deviceID,
    });
    res.status(200).send({newDevice: deviceID});
  } catch (err) {
    console.log('[iOLED-API][user][saveDevice][Error]', err);
    res.status(500).json(err);
  }
};

/**
 * @CristianValdivia
 * Delete device in the firestore database
 * @description Delte device
 * @param {{body: {deviceID: string}}} req Request.
 * @param {object} res Response.
 */
exports.deleteDevice = async (req, res) => {
  console.log('[iOLED-API][user][deleteDevice][Request]', req.params, req.body);
  const {deviceID} = req.body;

  try {
    const ref = await deleteDevice(deviceID);
    console.log('[iOLED-API][user][deleteDevice][Response]', {
      deleteDevice: deviceID,
    });
    res.status(200).send({deleteDevice: deviceID});
  } catch (err) {
    console.log('[iOLED-API][user][deleteDevice][Error]', err);
    res.status(500).json(err);
  }
};
