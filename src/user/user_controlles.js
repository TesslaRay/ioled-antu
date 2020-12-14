const jwt = require('jsonwebtoken');
const {
  getUser,
  getDevices,
  addDevice,
  deleteDevice,
  updateDeviceDB,
} = require('../services/firestore');

const {JWT_KEY} = require('../config/env');

/**
 * @CristianValdivia
 * Returns the current authenticated user.
 * @param {{user: object}} req googleID
 * @param {object} res Response.
 */
exports.currentUser = async (req, res) => {
  console.log('[iOLED-API][GET][user][currentUser][Request] ', req.params, req.body);
  let token = req.headers['authorization'];

  if (token) {
    token = token.replace('Bearer ', '');
    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        console.log('[iOLED-API][GET][user][currentUser][Error] : Invalid token');
        return res.send(false);
      } else {
        const {user} = decoded;
        try {
          // Search in the DB for the user.
          const {user: userInfo} = await getUser(user);
          console.log('[iOLED-API][GET][user][currentUser][Response]', userInfo);
          res.status(200).send([userInfo]);
        } catch (err) {
          console.log('[iOLED-API][GET][user][currentUser][Error]', err);
          res.status(500).json(err);
        }
      }
    });
  } else {
    console.log('[iOLED-API][GET][user][currentUser][Error]: No token');
    return res.send(false);
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
  console.log('[iOLED-API][GET][user][getDevices][Request] ', req.params, req.body);
  let token = req.headers['authorization'];

  if (token) {
    token = token.replace('Bearer ', '');
    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        console.log('[iOLED-API][GET][user][getDevices][Error] : Invalid token');
        return res.send(false);
      } else {
        const {user} = decoded;
        try {
          // Search in the DB for the devices.
          const devices = await getDevices(user);

          console.log('[iOLED-API][GET][user][getDevices][Response]', devices);
          res.status(200).send({devices});
        } catch (err) {
          console.log('[iOLED-API][GET][user][getDevices][Error]', err);
          res.status(500).json(err);
        }
      }
    });
  } else {
    console.log('[iOLED-API][GET][user][getDevices][Error]: No token');
    return res.send(false);
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
  console.log('[iOLED-API][POST][user][saveDevice][Request]', req.params, req.body);
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
    console.log('[iOLED-API][POST][user][saveDevice][Response]', {
      newDevice: deviceID,
    });
    res.status(200).send({newDevice: deviceID});
  } catch (err) {
    console.log('[iOLED-API][POST][user][saveDevice][Error]', err);
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
  console.log('[iOLED-API][POST][user][deleteDevice][Request]', req.params, req.body);
  const {deviceID} = req.body;

  try {
    await deleteDevice(deviceID);
    console.log('[iOLED-API][POST][user][deleteDevice][Response]', {
      deleteDevice: deviceID,
    });
    res.status(200).send({deleteDevice: deviceID});
  } catch (err) {
    console.log('[iOLED-API][POST][user][deleteDevice][Error]', err);
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
exports.changeDevice = async (req, res) => {
  console.log('[iOLED-API][POST][user][changeDevice][Request]', req.body);
  const id = req.body.deviceId;
  const config = req.body.config;

  try {
    await updateDeviceDB(id, config);
    console.log('[iOLED-API][POST][user][changeDevice][Response]', {
      changeDevice: config,
    });
    res.status(200).send({changeDevice: config});
  } catch (err) {
    console.log('[iOLED-API][POST][user][ChangeDevice][Error]', err);
    res.status(500).json(err);
  }
};
