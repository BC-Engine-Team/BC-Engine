module.exports = (mssql_bosco, DataTypes) => {
    const Transaction = mssql_bosco.define("ACCOUNTING_CLIENT_STAT", {
        connectionId: {
            field: 'CONNECTION_ID',
            type: DataTypes.INTEGER
        },
        transactionRef: {
            field: 'TRANSACTION_REF',
            type: DataTypes.STRING
        },
        transactionDate: {
            field: 'TRANSACTION_DATE',
            type: DataTypes.DATEONLY
        },
        amount: {
            field: 'AMOUNT',
            type: DataTypes.DECIMAL
        },
        yearMonth: {
            field: 'YEAR_MONTH',
            type: DataTypes.INTEGER
        },
        dueCurrent: {
            field: 'DUE_CURRENT',
            type: DataTypes.DECIMAL
        },
        due1Month: {
            field: 'DUE_1_MONTH',
            type: DataTypes.DECIMAL
        },
        due2Month: {
            field: 'DUE_2_MONTH',
            type: DataTypes.DECIMAL
        },
        due3Month: {
            field: 'DUE_3_MONTH',
            type: DataTypes.DECIMAL
        }
    },
    {
        modelName: 'TransactionStat',
        tableName: 'ACCOUNTING_CLIENT_STAT',
        underscore: true,
        timestamps: false
    });

    Transaction.removeAttribute('id');
    return Transaction;
};