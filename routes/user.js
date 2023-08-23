const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateUserProfile } = require('../controllers/user');

router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateUserProfile);

module.exports = router;
