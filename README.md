```
$ git clone https://github.com/Paqmind/minimal minimal
$ cd minimal
$ npm install
$ npm start
$ HTTP_PORT=3030 npm start
```

```javascript
// config.js example
// HTTP
module.exports.HTTP_PORT = 3030;

// SMTP
module.exports.SMTP_SERVER = "smtp.yandex.ru";
module.exports.SMTP_USERNAME = "xxx@yyy.com";
module.exports.SMTP_PASSWORD = "xxx";
module.exports.SMTP_PORT = 465;

// MAIL
module.exports.MAIL_ROBOT = "robot@yyy.com";
module.exports.MAIL_SUPPORT = "support@yyy.com";
```