// IMPORTS =========================================================================================
let path = require("path");
let http = require("http");
let util = require("util");
let winston = require("winston");
let winstonMail = require("winston-mail");
let Express = require("express");
let Moment = require("moment");
let config = require("./config");

// SETENV ==========================================================================================
process.env.HTTP_PORT = parseInt(process.env.HTTP_PORT || config.HTTP_PORT) || 3000;
process.env.SMTP_USERNAME = process.env.SMTP_USERNAME || config.SMTP_USERNAME;
process.env.SMTP_PASSWORD = process.env.SMTP_PASSWORD || config.SMTP_PASSWORD;
process.env.SMTP_PORT = parseInt(process.env.SMTP_PORT || config.SMTP_PORT) || 25;
process.env.MAIL_ROBOT = process.env.MAIL_ROBOT || config.MAIL_ROBOT;
process.env.MAIL_SUPPORT = process.env.MAIL_SUPPORT || config.MAIL_SUPPORT;

// LOGGING =========================================================================================
let customColors = {trace: "white", debug: "blue", info: "green", warn: "yellow", error: "red"};
let customLevels = {trace: 0, debug: 1, info: 2, warn: 3, error: 4};

winston.addColors(customColors);

let logger = new (winston.Logger)({
  colors: customColors,
  levels: customLevels,
  transports: [
    new winston.transports.Console({
      level: "info",
      colorize: true,
      timestamp: function() {
        return new Moment();
      },
      formatter: function(options) {
        let timestamp = options.timestamp().format("YYYY-MM-DD hh:mm:ss");
        let level = winston.config.colorize(options.level, options.level.toUpperCase());
        let message = options.message;
        let meta;
        if (options.meta instanceof Error) {
          meta = "\n  " + options.meta.stack;
        } else {
          meta = Object.keys(options.meta).length ? util.inspect(options.meta) : "";
        }
        return `${timestamp} ${level} ${message} ${meta}`;
      }
    }),
    new winston.transports.Mail({
      level: "error",
      host: "localhost",
      port: process.env.SMTP_PORT,
      username: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD,
      from: process.env.MAIL_ROBOT,
      to: process.env.MAIL_SUPPORT,
      subject: "Application Failed",
      ssl: true,
    }),
  ],
});

MAIL_SERVER = 'smtp.yandex.ru'
MAIL_PASSWORD = '7rDjr3fr'
MAIL_USE_SSL = True

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      logger.error(process.env.HTTP_PORT + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(process.env.HTTP_PORT + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  logger.info("Listening on port " + process.env.HTTP_PORT);
}

// ROUTES ==========================================================================================
let router = Express.Router();

router.get("/", (req, res, next) => {
    return res.status(200).sendFile(path.join(__dirname, "templates", "home.html"));
  }
);

router.get("/error", (req, res, next) => {
    throw Error("Demo error");
  }
);

router.get("/api", (req, res, next) => {
    return res.status(200).send({
      data: ["This", "is", "just", "for", "lulz"]
    });
  }
);

router.use(function(req, res, next) {
  return res.status(404).sendFile(path.join(__dirname, "templates", "404.html"));
});

router.use(function(err, req, res, next) {
  logger.error(err.stack);
  return res.status(err.status || 500).sendFile(path.join(__dirname, "templates", "500.html"));
});

// SERVERS =========================================================================================
let app = Express();

app.use("/", router);

let server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(process.env.PORT);