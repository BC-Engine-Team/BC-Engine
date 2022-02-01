module.exports = (mssql_bosco, DataTypes) => {
    const Client = mssql_bosco.define("NAME", {
        nameId:{
            field: 'NAME_ID',
            type: DataTypes.INTEGER
        },
        name1: {
            field: 'NAME_1',
            type: DataTypes.STRING
        },
        name2: {
            field: 'NAME_2',
            type: DataTypes.STRING
        },
        name3: {
            field: 'NAME_3',
            type: DataTypes.STRING
        }
    },
    {
        modelName: 'Client',
        tableName: 'NAME',
        underscore: true,
        timestamps: false
    });

    Client.removeAttribute('id');
    return Client;
};