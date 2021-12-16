const { DataTypes } = require("sequelize/dist");
const { mssql_pat, Sequelize } = require("../../mysqldb");

module.exports = (mssql_pat, DataTypes) => {
    const Employee = mssql_pat.define("PERSON", {
        firstName: {
            field: 'PERSON_FIRST_NAME',
            type: DataTypes.STRING
        },
        lastName: {
            field: 'PERSON_LAST_NAME',
            type: DataTypes.STRING
        },
        email: {
            primaryKey: true,
            field: 'EMAIL',
            type: DataTypes.STRING
        }
    },
    {
        modelName: 'Employee',
        tableName: 'PERSON',
        underscore: true,
        timestamps: false
    });

    Employee.removeAttribute('id');
    return Employee;
};