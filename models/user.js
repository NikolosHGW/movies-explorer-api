const mongoose = require('mongoose');
const validatorEmail = require('validator');
const bcrypt = require('bcryptjs');
const HandError = require('../errors/HandError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        if (validatorEmail.isEmail(v)) {
          return true;
        }
        throw new HandError('Некорректный email', 400);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new HandError('Неправильные почта или пароль', 401));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new HandError('Неправильные почта или пароль', 401));
          }
          return user;
        });
    });
}

userSchema.statics = { findUserByCredentials };

module.exports = mongoose.model('user', userSchema);
