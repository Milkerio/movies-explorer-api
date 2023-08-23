const { errorDefault } = require('./errors');

class ErrorDefault extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errorDefault;
  }
}

module.exports = ErrorDefault;
