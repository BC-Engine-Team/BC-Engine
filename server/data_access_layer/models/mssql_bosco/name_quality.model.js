module.exports = (mssql_bosco, DataTypes) => {
    const nameQuality = mssql_bosco.define("NAME_QUALITY", {
        dropdownCode: {
            field: 'DROPDOWN_CODE',
            type: DataTypes.INTEGER
        },
        nameId: {
            field: 'NAME_ID',
            type: DataTypes.INTEGER
        },
        dropdownId: {
            field: 'CROPDOWN_ID',
            type: DataTypes.INTEGER
        }
    },
    {
        modelName: 'nameQuality',
        tableName: 'NAME_QUALITY',
        underscore: true,
        timestamps: false
    });

    nameQuality.removeAttribute('id');
    return nameQuality;
};