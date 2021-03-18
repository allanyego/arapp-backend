const mongoose = require("mongoose");

const isTest = process.env.NODE_ENV === "test";
const dbName = !isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME;
const dbPassword = process.env.MONGO_PASS;

const mongoUrl = `mongodb+srv://safe360:${dbPassword}@cluster0.fhkpt.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
