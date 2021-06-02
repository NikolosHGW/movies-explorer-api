const jwt = require('jsonwebtoken');
const HandError = require('../errors/HandError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, _res, next) => {
  try {
    req.user = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
    next();
  } catch (err) {
    next(new HandError('Необходима авторизация', 401));
  }
};
