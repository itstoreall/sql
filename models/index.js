'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.json'))[env];
const db = {}; // Object for models

const sequelize = new Sequelize({
  dialect: config.dialect, // what dialect is used
  storage: config.storage, // where to store the file
});

fs.readdirSync(__dirname) // reads files synchronously from a folder
  // throw out the index.js
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  // reads all the models
  .forEach((file) => {
    // Skips files: sequelize, DataTypes to the models/index.js
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model; // adds model
  });

// Current set of models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

/**
 * Логика
 * - Считфваем все файлы
 * - Засовываем в экземпляр db
 * - Выполняем у всех метод associate
 *
 * Подгрузка всех моделей выполняется один раз при инициализации сервера
 */
