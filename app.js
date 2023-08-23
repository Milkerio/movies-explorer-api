const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const router = require('./routes/index');

const { PORT, DB_ADRESS } = require('./constants/constants');

const app = express();
mongoose.connect(DB_ADRESS);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://api.mlkr.diplom.nomoredomainsicu.ru', 'https://api.mlkr.diplom.nomoredomainsicu.ru'], credentials: true,
}));
app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});
app.listen(PORT);
