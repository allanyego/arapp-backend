const AT = require("africastalking")({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const createMessage = ({
  recipient,
  sender,
  senderPhone,
  locationName,
  latlng,
}) => {
  return (
    `${recipient}. It's ${sender}, I might be in trouble. Sent on behalf of ` +
    `[${senderPhone}], location: ${locationName}, coordinates: (${latlng.lat},${latlng.lng}).`
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
  return await AT.SMS.send({
    to: [recipientPhone],
    message: createMessage({
      recipient,
      sender,
      senderPhone,
      locationName,
      latlng,
    }),
  });
};

module.exports = sendSms;
