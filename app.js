// ENVIRON =========================================================================================
let config = require("./config");

process.env.HTTP_PORT = parseInt(process.env.HTTP_PORT || config.HTTP_PORT) || 3000;
process.env.SMTP_HOST = process.env.SMTP_HOST || config.SMTP_HOST;
process.env.SMTP_USERNAME = process.env.SMTP_USERNAME || config.SMTP_USERNAME;
process.env.SMTP_PASSWORD = process.env.SMTP_PASSWORD || config.SMTP_PASSWORD;
process.env.SMTP_PORT = parseInt(process.env.SMTP_PORT || config.SMTP_PORT) || 25;
process.env.SMTP_SSL = process.env.SMTP_SSL || config.SMTP_SSL || false;
process.env.MAIL_ROBOT = process.env.MAIL_ROBOT || config.MAIL_ROBOT || "robot@localhost";
process.env.MAIL_SUPPORT = process.env.MAIL_SUPPORT || config.MAIL_SUPPORT || "support@localhost";

// IMPORTS =========================================================================================
let Path = require("path");
let Os = require("os");
let Http = require("http");
let Emailjs = require("emailjs");
let Express = require("express");

// ROUTES ==========================================================================================
let router = Express.Router();

router.get("/", (req, res, next) => {
  return res.status(200).sendFile(Path.join(__dirname, "templates", "home.html"));
});

router.get("/error", (req, res, next) => {
  var server  = Emailjs.server.connect({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    ssl: process.env.SMTP_SSL,
  });

  server.send({
   text: "I hope this works",
   from: process.env.MAIL_ROBOT,
   to: process.env.MAIL_SUPPORT,
   subject: `Mail test | ${Os.hostname()}`,
  }, function(err, message) { console.log(err || message); });
  throw Error("Demo error");
});

router.get("/api", (req, res, next) => {
  return res.status(200).send({
    data: ["This", "is", "just", "for", "lulz"]
  });
});

router.use(function(req, res, next) {
  return res.status(404).sendFile(Path.join(__dirname, "templates", "404.html"));
});

router.use(function(err, req, res, next) {
  console.log(err.stack);
  return res.status(err.status || 500).sendFile(Path.join(__dirname, "templates", "500.html"));
});

// APP =============================================================================================
let app = Express();

app.use("/", router);

// SERVER ==========================================================================================
let server = Http.createServer(app);

server.on("error", onError);
server.on("listening", onListening);
server.listen(process.env.HTTP_PORT);

// HELPERS =========================================================================================
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      console.log(process.env.HTTP_PORT + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(process.env.HTTP_PORT + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  console.log("Listening on port " + process.env.HTTP_PORT);
}