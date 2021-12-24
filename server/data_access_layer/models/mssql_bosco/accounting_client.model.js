module.exports = (mssql_bosco, DataTypes) => {
    const Transaction = mssql_bosco.define("ACCOUNTING_CLIENT", {
        connectionId: {
            field: 'CONNECTION_ID',
            type: DataTypes.INTEGER
        },
        transactionRef: {
            field: 'TRANSACTION_REF',
            type: DataTypes.STRING
        },
        clearingDueDate: {
            field: 'CLEARING_DUE_DATE',
            type: DataTypes.DATEONLY
        },
        transactionAmmount: {
            field: 'TRANSACTION_AMOUNT',
            type: DataTypes.DECIMAL(19, 2)
        }
    },
    {
        modelName: 'Transaction',
        tableName: 'ACCOUNTING_CLIENT',
        underscore: true,
        timestamps: false
    });

    Transaction.removeAttribute('id');
    return Transaction;
};