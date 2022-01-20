module.exports = (mssql_pat, DataTypes) => {
    const InvoiceAffect = mssql_pat.define("BOSCO_INVOICE_AFFECT", {
        amount: {
            field: 'AFFECT_AMOUNT',
            type: DataTypes.DECIMAL
        },
        invoiceId: {
            primaryKey: true,
            field: 'INVOICE_ID',
            type: DataTypes.STRING
        },
        account: {
            field: 'AFFECT_ACCOUNT',
            type: DataTypes.STRING
        }
    },
        {
            modelName: 'InvoiceAffect',
            tableName: 'BOSCO_INVOICE_AFFECT',
            underscore: true,
            timestamps: false
        });

    InvoiceAffect.removeAttribute('id');
    return InvoiceAffect;
};