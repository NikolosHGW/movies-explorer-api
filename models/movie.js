const mongoose = require('mongoose');
const HandError = require('../errors/HandError');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        if (/\bhttps?:\/\/[a-z0-9-._~:/?#[\]@!$&'()*+,;=]/g.test(v)) {
          return true;
        }
        throw new HandError('Некорректная ссылка', 400);
      },
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        if (/\bhttps?:\/\/[a-z0-9-._~:/?#[\]@!$&'()*+,;=]/g.test(v)) {
          return true;
        }
        throw new HandError('Некорректная ссылка', 400);
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        if (/\bhttps?:\/\/[a-z0-9-._~:/?#[\]@!$&'()*+,;=]/g.test(v)) {
          return true;
        }
        throw new HandError('Некорректная ссылка', 400);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
