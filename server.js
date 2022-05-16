const express = require("express");
const req = require("express/lib/request");
const bodyParser = require("body-parser");

const app = express();
exports.app = app;
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var session = require("./session");

app.use(session);

var passport = require("./auth");
app.use(passport.authenticate("session"));

app.set("view engine", "ejs");
app.set("views", "./views");

var indexRouter = require("./routes/index");
var loginRouter = require("./routes/login")(passport);

app.use("/", indexRouter);
app.use("/", loginRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
