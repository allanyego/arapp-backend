const mongoose = require("mongoose");

const mongoUrl = `mongodb+srv://afyamedex:${process.env.DB_PASS}@cluster0.lygm5.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
