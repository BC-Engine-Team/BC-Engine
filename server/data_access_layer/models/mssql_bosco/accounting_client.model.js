module.exports = (mssql_bosco, DataTypes) => {
    const Transaction = mssql_bosco.define("ACCOUNTING_CLIENT", {
        connectionId: {
            field: 'CONNECTION_ID',
            type: DataTypes.INTEGER
        },
        patInvoiceId: {
            field: 'PAT_INVOICE_ID',
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
        clearingDueAmount: {
            field: 'CLEARING_DUE_AMOUNT',
            type: DataTypes.DECIMAL
        },
        transactionAmount: {
            field: 'TRANSACTION_AMOUNT',
            type: DataTypes.DECIMAL(19, 2)
        },
        transactionDate: {
            field: 'TRANSACTION_DATE',
            type: DataTypes.DATEONLY
        },
        clearingLastTransaction: {
            field: 'CLEARING_LAST_TRANSACTION',
            type: DataTypes.DATEONLY
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