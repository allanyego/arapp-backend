const express = require("express");
const { Client } = require("@googlemaps/google-maps-services-js");
const Nexmo = require("nexmo");

const auth = require("../middleware/auth");
const schema = require("../joi-schemas/incident");
const createResponse = require("./helpers/create-response");
const controller = require("../controllers/incidents");
const userController = require("../controllers/users");
const isClientError = require("../util/is-client-error");
const sendSms = require("./helpers/send-sms");
const signUrl = require("./helpers/sign-url");
const verifyRequest = require("./helpers/verify-request");
const sendVideo = require("../middleware/send-video");

const mapsClient = new Client();
// const nexmo = new Nexmo({
//   apiKey: process.env.VONAGE_API_KEY,
//   apiSecret: process.env.VONAGE_API_SECRET,
// });

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

router.get("/video/token", auth, async (req, res, next) => {
  try {
    res.json(
      createResponse({
        data: signUrl(res.locals.userId),
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get(
  "/video/:filename",
  async function (req, res, next) {
    const { token } = req.query;
    let userId;

    if (!token) {
      return res.sendStatus(403);
    }

    try {
      userId = verifyRequest(token).userId;
      res.locals.userId = userId;
      next();
    } catch (error) {
      res.sendStatus(403);
    }
  },
  sendVideo
);

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
    if (!user) {
      return res.json(
        createResponse({
          error: "Operation allowed for app users only.",
        })
      );
    }

    await sendSms({
      recipient: contact.displayName,
      recipientPhone: contact.phone,
      sender: user.fullName,
      senderPhone: user.phone,
      locationName: req.body.location.name,
      latlng: {
        lat: req.body.location.latitude,
        lng: req.body.location.longitude,
      },
    })
      .then(async (response) => {
        const incident = await controller.add({
          sendSuccess: true,
          ...req.body,
        });

        res.status(201).json(
          createResponse({
            data: {
              ...response,
              ...incident.toJSON(),
            },
          })
        );
      })
      .catch(async (error) => {
        const incident = await controller.add({
          sendSuccess: false,
          ...req.body,
        });

        return res.status(400).json(
          createResponse({
            data: incident,
          })
        );
      });

    // nexmo.message.sendSms(
    //   user.phone,
    //   contact.phone,
    //   text,
    //   async (err, responseData) => {
    //     let sendSuccess = false,
    //       errorText;

    //     if (err) {
    //       errorText = err.message;
    //     } else {
    //       if (responseData.messages[0]["status"] === "0") {
    //         sendSuccess = true;
    //       } else {
    //         errorText = responseData.messages[0]["error-text"];
    //       }
    //     }

    //     const incident = await controller.add({
    //       sendSuccess,
    //       ...req.body,
    //     });

    //     res.status(201).json(
    //       createResponse({
    //         data: {
    //           errorText,
    //           ...incident.toJSON(),
    //         },
    //       })
    //     );
    //   }
    // );
  } catch (error) {
    if (isClientError(error)) {
      return res.status(400).json(
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
