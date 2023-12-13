const express = require("express");
require("dotenv").config();
// const authentication = require("./routes/authentication");
const payment = require("./routes/payment");

const { default: mongoose } = require("mongoose");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api", payment);

app.use((error, req, res, next) => {
  console.log(error.message);
  console.log(error.statusCode);

  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

const mongodb_URI = `mongodb+srv://saif:${process.env.MONGODB_PASSWORD}@cluster0.6zbtdaz.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set("strictQuery", true);
//connecting  to the database
mongoose
  .connect(mongodb_URI)
  .then((result) => {
    //when the connection is successful listen to the port
    app.listen(process.env.PORT || 8070, function () {
      console.log(
        "Express server listening on port %d in %s mode",
        this.address().port,
        app.settings.env
      );
    });
  })
  .catch((err) => console.log(err));