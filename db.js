const { Sequelize } = require('sequelize');

const db = new Sequelize("postgres://postgre:postgre@localhost:5432/animal-server");

module.exports = db;