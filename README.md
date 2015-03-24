```
$ git clone https://github.com/Paqmind/minimal minimal
$ cd minimal
$ npm install
$ npm start
$ HTTP_PORT=3030 npm start
```

```javascript
// ./config.js example
export default {
  // HTTP
  HTTP_PORT: 3030,

  // SMTP
  SMTP_HOST: "smtp.yandex.ru",
  SMTP_USERNAME: "robot@xxx.com",
  SMTP_PASSWORD: "xxx",
  SMTP_PORT: 465,
  SMTP_SSL: true,

  // MAILS
  MAIL_ROBOT: "robot@xxx.com",
  MAIL_SUPPORT: "support@xxx.com",
};
```