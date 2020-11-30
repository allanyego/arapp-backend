const USER = {
  ACCOUNT_TYPES: {
    USER: "USER",
    COUNSELLOR: "COUNSELLOR",
    HEALTH_FACILITY: "HEALTH_FACILITY",
    ADMIN: "ADMIN",
    LAW_ENFORCER: "LAW_ENFORCER",
  },
};

const APPOINTMENT = {
  STATUSES: {
    UNANSWERED: "UNANSWERED",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    CLOSED: "CLOSED",
  },
};

const PROFILE_PICTURE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
];

const TEST_RESET_CODE = "345656";

const REGEX = {
  PHONE: /^\+(?:[0-9]\x20?){6,14}[0-9]$/,
};

const INCIDENT_TYPES = {
  SMS: "SMS",
  VIDEO: "VIDEO",
};

module.exports = {
  APPOINTMENT,
  INCIDENT_TYPES,
  USER,
  PROFILE_PICTURE_FORMATS,
  REGEX,
  TEST_RESET_CODE,
};
