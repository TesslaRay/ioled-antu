const Firestore = require('@google-cloud/firestore');

const {projectId} = require('../config/env');

const db = new Firestore({
  projectId,
});

const devicesRef = db.collection('devices');
const usersRef = db.collection('users');

exports.getUser = async (googleID) => {
  try {
    const snapshot = await usersRef.where('googleID', '==', googleID).get();

    if (snapshot.empty) {
      console.log('[iOLED-API][Firestore][getUser] No matching documents'.red);
      return null;
    } else {
      let userId, user;
      snapshot.forEach((doc) => {
        userId = doc.id;
        user = doc.data();
      });
      return {userId, user};
    }
  } catch (err) {
    console.log('[iOLED-API][Firestore][getUser]'.red, err);
    return null;
  }
};

exports.getDevices = async (userID) => {
  try {
    const snapshot = await devicesRef.where('user', '==', userID).get();
    const devices = snapshot.docs.map((doc) => doc.data());
    return devices;
  } catch (err) {
    console.log('[iOLED-API][Firestore][getDevices]'.red, err);
    return null;
  }
};

exports.isAdmin = (user) => {
  if (user.role === 'admin') return true;
  else return false;
};

exports.addDevice = async (device) => {
  try {
    const ref = await devicesRef.add(device);

    console.log('[iOLED-API][Firestore][Save Device] New Device Added:', ref.id);
    return ref;
  } catch (err) {
    console.log(
      '[iOLED-API][Firestore][Save Device][Error] There was an error saving the new device',
      err
    );
    throw new Error(err);
  }
};

exports.saveUser = async (user) => {
  try {
    if (user.lastName === undefined) {
      console.log('[iOLED-API][Firestore][Save User] Invalid lastName'.red);
      user.lastName = '.';
    }

    const ref = await usersRef.add(user);
    console.log(`[iOLED-API][Firestore][Save User] New User Added: ${user.googleID}`.red);
    return user.googleID;
  } catch (err) {
    console.log(
      `[iOLED-API][Firestore][Save User][Error] There was an error saving the new user ${err}`.red
    );
    throw new Error(err);
  }
};

exports.getAllDevicesWithUserInfo = async () => {
  try {
    const snapshot = await devicesRef.get();
    const data = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {deviceID: data.deviceID, user: data.user};
    });
    for (let index = 0; index < data.length; index++) {
      const device = data[index];
      const userId = device.user;

      if (userId !== '') {
        const doc = await usersRef.where('googleID', '==', userId).get();
        if (doc.empty) {
          console.log('[User-API][Firestore][getAllDevicesWithUserInfo] No user found');
          return null;
        }
        let userInfo;
        doc.forEach((doc) => {
          userInfo = doc.data();
        });
        device.user = {
          name: capitalize(`${userInfo.name} ${userInfo.lastName}`),
          email: userInfo.email,
          photo: userInfo.photo,
        };
      } else {
        device.user = null;
      }
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUserByDevice = async (id) => {
  try {
    const snapshot = await devicesRef.where('deviceID', '==', id).get();
    if (snapshot.empty) {
      console.log('[User-API][Firestore][getUserByDevice] Device not found');
      return null;
    }
    let device;
    snapshot.forEach((doc) => {
      device = doc.data();
    });
    const userId = device.user;
    const doc = await usersRef.where('googleID', '==', userId).get();
    if (doc.empty) {
      console.log('[User-API][Firestore][getUserByDevice] No user found');
      return null;
    }
    let user;
    doc.forEach((doc) => {
      user = doc.data();
    });
    return {
      name: capitalize(`${user.name} ${user.lastName}`),
      email: user.email,
      photo: user.photo,
    };
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @CristianValdivia
 * Update the config of device
 * @description Update config of device in Firestore
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {Function} next Callback function
 */
exports.updateDevice = async (id, config) => {
  try {
    await devicesRef
      .where('deviceID', '==', id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          devicesRef.doc(doc.id).update(config);
        });
      });
    console.log('[User-API][Firestore][updateDevice] Update config:', config);
  } catch (error) {
    console.log(
      '[User-API][Firestore][updateDevice] [Error] There was an error update config',
      error
    );
    throw new Error(error);
  }
};
