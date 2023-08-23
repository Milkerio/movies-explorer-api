const { errorBadRequest } = require('./errors');

class ErrorBadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errorBadRequest;
  }
}

module.exports = ErrorBadRequest;
