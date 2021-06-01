const mongoose = require('mongoose');
const validatorEmail = require('validator');
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

module.exports = mongoose.model('user', userSchema);
