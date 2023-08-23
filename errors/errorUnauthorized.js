const { errorUnauthorized } = require('./errors');

class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errorUnauthorized;
  }
}

module.exports = ErrorUnauthorized;
