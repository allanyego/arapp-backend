const isProduction = require("../../util/is-production");

const AT = require("africastalking")({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const ucFirst = (s, split = undefined) => {
  const helper = (str) => str[0].toUpperCase() + str.slice(1);

  if (!split) {
    return helper(s);
  }

  return s
    .split(split)
    .map((letter) => helper(letter))
    .join(split);
};

const createMessage = ({
  recipient,
  sender,
  senderPhone,
  locationName,
  latlng,
}) => {
  return (
    `Hi ${ucFirst(recipient)}. ${ucFirst(
      sender,
      " "
    )} might be in trouble. Sent on user's behalf ` +
    `[${senderPhone}] DO NOT call them immediately, location: ${locationName}, ` +
    `(${latlng.lat.toFixed(2)},${latlng.lng.toFixed(2)}).`
  );
};

const sendSms = async ({
  recipient,
  recipientPhone,
  sender,
  senderPhone,
  locationName,
  latlng,
}) => {
  return isProduction()
    ? await AT.SMS.send({
        to: [recipientPhone],
        message: createMessage({
          recipient,
          sender,
          senderPhone,
          locationName,
          latlng,
        }),
      })
    : true;
};

module.exports = sendSms;
