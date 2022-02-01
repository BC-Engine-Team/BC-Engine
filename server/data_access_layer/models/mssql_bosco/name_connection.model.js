module.exports = (mssql_bosco, DataTypes) => {
    const nameConnection = mssql_bosco.define("NAME_CONNECTION", {
        connectionNameId: {
            field: 'CONNECTION_NAME_ID',
            type: DataTypes.INTEGER
        },
        nameId: {
            field: 'NAME_ID',
            type: DataTypes.INTEGER
        }
    },
    {
        modelName: 'nameConnection',
        tableName: 'NAME_CONNECTION',
        underscore: true,
        timestamps: false
    });

    nameConnection.removeAttribute('id');
    return nameConnection;
};