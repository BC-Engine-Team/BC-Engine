module.exports = (mssql_bosco, DataTypes) => {
    const Transaction = mssql_bosco.define("ACCOUNTING_CLIENT", {
        conectionId: {
            field: 'CONNECTION_ID',
            type: DataTypes.INTEGER
        },
        transactionRef: {
            field: 'TRANSACTION_REF',
            type: DataTypes.STRING
        },
        clearingDueDate: {
            field: 'CLEARING_DUE_DATE',
            type: DataTypes.DATE
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