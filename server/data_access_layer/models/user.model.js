const { DataTypes } = require("sequelize/dist");
const { sequelize, Sequelize } = require("../mysqldb");
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("users", {
        userId: {
            field: 'user_id',
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            field: 'user_email',
            type: DataTypes.STRING,
            
            allowNull: false
        },
        password: {
            field: 'user_password',
            type: DataTypes.STRING
        },
        name: {
            field: 'user_name',
            type: DataTypes.STRING
        },
        role: {
            field: 'user_role',
            type: DataTypes.STRING
        }
    });
    return User;
};