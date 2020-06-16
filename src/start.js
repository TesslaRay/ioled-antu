const { ioledAPI } = require("./index");

const PORT = process.env.PORT;

if (PORT === undefined) {
  console.log("[iOLED-API][Error] No port specified in the env variables");
  process.exit(1);
}

ioledAPI.listen(PORT, () => {
  console.log("[iOLED-API] Listening on port", PORT);
});
