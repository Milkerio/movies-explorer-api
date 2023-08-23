const {
  PORT = 3000,
  DB_ADRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  JWT_SECRET,
  NODE_ENV,
} = process.env;

module.exports = {
  PORT,
  DB_ADRESS,
  JWT_SECRET,
  NODE_ENV,
};
