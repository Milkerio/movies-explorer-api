const ErrorBadRequest = require('../errors/errorBadRequest');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorForbidden = require('../errors/errorForbidden');
const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};
module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
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
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.send(movie);
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
  Movie.findById(req.params._id)
    .orFail(() => new ErrorNotFound('Фильм с указанным id не найден.'))
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        Movie.deleteOne(movie)
          .then(() => res.send(movie))
          .catch(next);
      } else {
        throw new ErrorForbidden('Вы не можете удалять чужие фильмы.');
      }
    })
    .catch(next);
};
