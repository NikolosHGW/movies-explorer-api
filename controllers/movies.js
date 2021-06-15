const HandError = require('../errors/HandError');
const movieModel = require('../models/movie');

function getMovies(_, res, next) {
  movieModel.find({})
    .then((movies) => res.send(movies))
    .catch(next);
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const { _id: owner } = req.user;
  movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch(next);
}

function deleteMovie(req, res, next) {
  const { movieId } = req.params;
  const { _id } = req.user;
  movieModel.findById(movieId)
    .orFail(new HandError('Фильм с указанным _id не найдена', 404))
    .then((movie) => {
      if (movie.owner.toString() !== _id) {
        throw new HandError('Нельзя удалить чужой фильм?', 403);
      }
      return movie.remove()
        .then(() => res.send({ message: 'Фильм удалён' }));
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
