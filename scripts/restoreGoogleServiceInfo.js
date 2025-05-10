/* eslint-disable */
const fs = require("fs");

const base64 = process.env.GOOGLE_SERVICE_INFO_PLIST;
if (!base64) {
  throw new Error("GOOGLE_SERVICE_INFO_PLIST is not set");
}

fs.writeFileSync("GoogleService-Info.plist", Buffer.from(base64, "base64"));
console.log("✅ GoogleService-Info.plist restored");
