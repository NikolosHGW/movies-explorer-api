const { errors, celebrate, Joi } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');
const HandError = require('./errors/HandError');
const userRout = require('./routes/users');
const movieRout = require('./routes/movies');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);
app.post('/logout', (_, res, next) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: true, // должно быть 'none'
      // secure: true,
    }).end();
  } catch (err) {
    next(err);
  }
});
app.use(userRout);
app.use(movieRout);

app.use(() => {
  throw new HandError('Запрашиваемый ресурс не найден', 404);
});

app.use(errorLogger);

app.use(errors());

app.use((err, _req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT);
