const { Buffer } = require("safe-buffer");
const KeyGrip = require("keygrip");
const keyConfig = require("../../config/keys");
const keyGrip = new KeyGrip([keyConfig.cookieKey]);

module.exports = (user) => {
  const sessionObj = {
    passport: {
      user: user._id.toString()
    }
  };
  const session = Buffer.from(JSON.stringify(sessionObj)).toString("base64");
  const sig = keyGrip.sign(`session=${session}`);
  return { session, sig };
};
