const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRoute = sequelize.define('UserRoute', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    routeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED'),
        defaultValue: 'IN_PROGRESS'
    }
}, {
    tableName: 'UserRoutes',
    timestamps: true
});

module.exports = UserRoute;