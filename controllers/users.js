const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HandError = require('../errors/HandError');
const userModel = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

function getIdError() {
  return new HandError('Пользователь по указанному _id не найден', 404);
}

function getCurrentUser(req, res, next) {
  const { _id } = req.user;
  userModel.findById(_id)
    .orFail(getIdError())
    .then((user) => res.send(user))
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({ email, password: hash, name }))
    .then((user) => {
      const {
        email: createdEmail,
        name: createdName,
        _id,
      } = user;
      res.send({
        email: createdEmail,
        name: createdName,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new HandError('Такой email уже существует', 409));
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  const { email, name } = req.body;
  const { _id } = req.user;
  userModel.findByIdAndUpdate(
    _id,
    { email, name },
    { new: true, runValidators: true, upsert: false },
    (err) => {
      if (err) {
        next(new HandError('Такой email уже существует', 409));
      }
    },
  )
    .orFail(getIdError())
    .then((user) => res.send(user))
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const { _id } = user;
      const token = jwt.sign(
        { _id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: 'mymovies.nomoredomains.',
      }).cookie('isLogged', 'true', {
        maxAge: 3600000 * 24 * 7,
      }).send({ _id });
    })
    .catch(next);
}

module.exports = {
  getCurrentUser,
  createUser,
  updateUser,
  login,
};
