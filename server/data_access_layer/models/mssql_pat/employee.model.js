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
            field: 'EMAIL',
            type: DataTypes.STRING
        },
        isActive: {
            field: 'IS_ACTIV',
            type: DataTypes.BOOLEAN
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