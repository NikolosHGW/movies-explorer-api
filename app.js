require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const HandError = require('./errors/HandError');
const userRout = require('./routes/users');
const movieRout = require('./routes/movies');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const { PORT = 3001, NODE_ENV, NAME_DB } = process.env;

const mongoPath = NODE_ENV === 'production' ? NAME_DB : 'mongodb://localhost:27017/bitfilmsdb';

const app = express();

const whitelist = ['https://mymovies.nomoredomains.club', 'http://localhost:3000'];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

mongoose.connect(mongoPath, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(requestLogger);
app.post('/logout', (_, res, next) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      domain: '.nomoredomains.icu',
      sameSite: 'none',
      secure: true,
    }).clearCookie('isLogged', {
      domain: '.nomoredomains.icu',
    }).send({ message: 'Clear Coockie' });
  } catch (err) {
    next(err);
  }
});
app.use(userRout);
app.use(movieRout);

app.use(cookieParser(), auth, () => {
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
