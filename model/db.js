const mongoose = require('mongoose');
require('dotenv').config();
const uriDB = process.env.URI_DB;

const db = mongoose.connect(uriDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 5,
});

mongoose.connection.on('connect', () => {
  console.log('Database connection successful');
});

mongoose.connection.on('error', error => {
  console.log(`Database connection error: ${error.message}`);
  process.exit(1);
});

mongoose.connection.on('disconnected', () => {
  console.log('Database disconnection');
});

process.on('SIGINT', async () => {
  mongoose.connected.close(() => {
    console.log('Database disconnect');
    process.exit();
  });
});

module.exports = db;
