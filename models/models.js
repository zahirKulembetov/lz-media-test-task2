const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Person = sequelize.define('person', {
   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
   name: { type: DataTypes.STRING },
   surname: { type: DataTypes.STRING },
});

module.exports = {
   Person
};