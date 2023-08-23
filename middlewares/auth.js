const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../errors/errorUnauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret');
  } catch (err) {
    next(new ErrorUnauthorized('Вы не авторизовались.'));
  }
  req.user = payload;

  next();
};
