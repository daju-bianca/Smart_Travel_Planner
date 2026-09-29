const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prompt_used: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    oras: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    places: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    tableName: 'Routes',
    timestamps: true
});

module.exports = Route;