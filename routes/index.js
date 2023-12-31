const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./user');
const movieRoutes = require('./movie');
const auth = require('../middlewares/auth');
const { createUser, authorize } = require('../controllers/user');
const ErrorNotFound = require('../errors/errorNotFound');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), authorize);

router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

router.use('*', auth, (req, res, next) => {
  next(new ErrorNotFound('Данного пути не существует.'));
});

module.exports = router;
