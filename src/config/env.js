const JWT_KEY = process.env.JWT_KEY;
if (JWT_KEY === undefined) {
  console.log('[Gateway API][Error] No JWT Key specified in the env variables');
  process.exit(1);
}

const HISTORY_URL = process.env.HISTORY_URL;
if (HISTORY_URL === undefined) {
  console.log('[Gateway API][Error] No History URL specified in the env variables');
  process.exit(1);
}

const DEVICE_CONTROL_URL = process.env.DEVICE_CONTROL_URL;
if (DEVICE_CONTROL_URL === undefined) {
  console.log('[Gateway API][Error] No Device Control URL specified in the env variables');
  process.exit(1);
}

const USER_URL = process.env.USER_URL;
if (USER_URL === undefined) {
  console.log('[Gateway API][Error] No User URL specified in the env variables');
  process.exit(1);
}

const MAILER_URL = process.env.MAILER_URL;
if (MAILER_URL === undefined) {
  console.log('[Gateway API][Error] No Mailer URL specified in the env variables');
  process.exit(1);
}

const googleClientID = '46245556778-28gfjj91h2kcjut7asa0330eqqcicjti.apps.googleusercontent.com';
if (googleClientID === undefined) {
  console.log('[Gateway API][Error] No google Client ID specified in the env variables');
  process.exit(1);
}

const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (googleClientSecret === undefined) {
  console.log('[Gateway API][Error] No google Client Secret specified in the env variables');
  process.exit(1);
}

const PROJECT_ID = process.env.PROJECT_ID;
if (PROJECT_ID === undefined) {
  console.log('[Gateway API][Error] No Project ID specified in the env variables');
  process.exit(1);
}

module.exports = {
  JWT_KEY,
  HISTORY_URL,
  DEVICE_CONTROL_URL,
  MAILER_URL,
  USER_URL,
  googleClientID,
  googleClientSecret,
  PROJECT_ID,
};
