const { errorForbidden } = require('./errors');

class ErrorForbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errorForbidden;
  }
}

module.exports = ErrorForbidden;
