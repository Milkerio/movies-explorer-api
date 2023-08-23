const { errorNotFound } = require('./errors');

class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errorNotFound;
  }
}

module.exports = ErrorNotFound;
