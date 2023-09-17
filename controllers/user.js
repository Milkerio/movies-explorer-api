const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ErrorBadRequest = require('../errors/errorBadRequest');
const ErrorConflict = require('../errors/errorConflict');
const ErrorUnauthorized = require('../errors/errorUnauthorized');
const ErrorNotFound = require('../errors/errorNotFound');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    throw new ErrorBadRequest('Все поля обязательны к заполнению!');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then(() => res.send({
          data: {
            name, email,
          },
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ErrorConflict('Пользователь с данным email существует.'));
            return;
          }
          if (err.name === 'ValidationError') {
            throw new ErrorBadRequest('Переданы некорректные данные.');
          }
          next(err);
        });
    })
    .catch(next);
};
module.exports.authorize = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new ErrorUnauthorized('Вы не авторизовались. Проверьте почту или пароль.'));
    });
};
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new ErrorNotFound('Пользователя с указанным id не существует.'))
    .then((user) => res.send(user))
    .catch(next);
};
module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrorBadRequest('Некорректные данные');
      } else {
        next(err);
      }
    });
};
