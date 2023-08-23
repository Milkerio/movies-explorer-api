const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { validateUrl } = require('../validation/urlValidation');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl),
    trailerLink: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
