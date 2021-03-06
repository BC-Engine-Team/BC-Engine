module.exports = (mssql_bosco, DataTypes) => {
    const Name = mssql_bosco.define("NAME", {
        nameID: {
            field: 'NAME_ID',
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        firstName: {
            field: 'NAME_1',
            type: DataTypes.STRING
        },
        lastName: {
            field: 'NAME_3',
            type: DataTypes.STRING
        }
    },
    {
        modelName: 'Name',
        tableName: 'NAME',
        underscore: true,
        timestamps: false
    });

    Name.removeAttribute('id');
    return Name;
};