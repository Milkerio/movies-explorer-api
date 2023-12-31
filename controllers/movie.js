const ErrorBadRequest = require('../errors/errorBadRequest');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorForbidden = require('../errors/errorForbidden');
const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      movie.populate(['owner'])
        .then(() => res.send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrorBadRequest('Переданные данные некорректны');
      } else {
        next(err);
      }
    });
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new ErrorNotFound('Фильм с указанным id не найден.'))
    .then((movie) => {
      if (`${movie.owner}` !== req.user._id) {
        throw new ErrorForbidden('Отказано в доступе');
      }
      return movie.deleteOne()
        .then(() => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Неверный id фильма'));
        return;
      }
      next(err);
    });
};
