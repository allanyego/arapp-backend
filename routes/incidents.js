const express = require("express");
const { Client } = require("@googlemaps/google-maps-services-js");
const Nexmo = require("nexmo");

const auth = require("../middleware/auth");
const schema = require("../joi-schemas/incident");
const createResponse = require("./helpers/create-response");
const controller = require("../controllers/incidents");
const userController = require("../controllers/users");
const isClientError = require("../util/is-client-error");

const mapsClient = new Client();
const nexmo = new Nexmo({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

const router = express.Router();

router.get("/:userId", auth, async function (req, res, next) {
  if (res.locals.userId !== req.params.userId) {
    return res.status(401).json(
      createResponse({
        error: "unauthorized access",
      })
    );
  }

  try {
    res.json(
      createResponse({
        data: await controller.getUserIncidents(req.params.userId),
      })
    );
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async function (req, res, next) {
  try {
    await schema.newSchema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json(
      createResponse({
        error: error.message,
      })
    );
  }

  try {
    req.body.location.name = await getLocationName(req.body.location);

    const { contact } = req.body;
    const user = await userController.findById(req.body.user);

    const text = createMessage({
      recipient: contact.displayName,
      sender: user.fullName,
      senderPhone: user.phone,
      locationName: req.body.location.name,
      latlng: {
        lat: req.body.location.latitude,
        lng: req.body.location.longitude,
      },
    });

    nexmo.message.sendSms(
      user.phone,
      contact.phone,
      text,
      async (err, responseData) => {
        let sendSuccess = false,
          errorText;

        if (err) {
          errorText = err.message;
        } else {
          if (responseData.messages[0]["status"] === "0") {
            sendSuccess = true;
          } else {
            errorText = responseData.messages[0]["error-text"];
          }
        }

        const incident = await controller.add({
          sendSuccess,
          ...req.body,
        });

        res.status(201).json(
          createResponse({
            data: {
              errorText,
              ...incident.toJSON(),
            },
          })
        );
      }
    );
  } catch (error) {
    console.log("req error", error);
    if (isClientError(error)) {
      return res.json(
        createResponse({
          error: error.message,
        })
      );
    }

    next(error);
  }
});

module.exports = router;

async function getLocationName(location) {
  const { data } = await mapsClient.reverseGeocode({
    params: {
      latlng: location,
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  return data.results[0].formatted_address;
}

function createMessage({
  recipient,
  sender,
  senderPhone,
  locationName,
  latlng,
}) {
  return (
    `Hi, ${recipient}. ${sender} might be in trouble. Sent on behalf of ` +
    `[${senderPhone}], location: ${locationName}, coordinates: (${latlng.lat},${latlng.lng}).`
  );
}
