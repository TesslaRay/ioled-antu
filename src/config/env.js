const JWT_KEY = process.env.JWT_KEY;
if (JWT_KEY === undefined) {
  console.log("[iOLED-API][Error] No JWT Key specified in the env variables");
  process.exit(1);
}

const googleClientID = process.env.GOOGLE_CLIENT_ID;
if (googleClientID === undefined) {
  console.log(
    "[iOLED-API][Error] No google Client ID specified in the env variables"
  );
  process.exit(1);
}

const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (googleClientSecret === undefined) {
  console.log(
    "[iOLED-API][Error] No google Client Secret specified in the env variables"
  );
  process.exit(1);
}

const PROJECT_ID = process.env.PROJECT_ID;
if (PROJECT_ID === undefined) {
  console.log(
    "[iOLED-API][Error] No Project ID specified in the env variables"
  );
  process.exit(1);
}

module.exports = {
  JWT_KEY,
  googleClientID,
  googleClientSecret,
  PROJECT_ID,
};
