const { errorConflict } = require('./errors');

class ErrorConflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errorConflict;
  }
}

module.exports = ErrorConflict;
