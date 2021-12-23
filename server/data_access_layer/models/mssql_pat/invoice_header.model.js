module.exports = (mssql_pat, DataTypes) => {
    const InvoiceHeader = mssql_pat.define("INVOICE_HEADER", {
        actorId: {
            field: 'ACTOR_ID',
            type: DataTypes.INTEGER
        },
        invoiceId: {
            primaryKey: true,
            field: 'INVOICE_ID',
            type: DataTypes.STRING
        },
        invoiceDate: {
            field: 'INVOICE_DATE',
            type: DataTypes.DATE
        },
        invoiceType: {
            field: 'INVOICE_TYPE',
            type: DataTypes.INTEGER
        }
    },
    {
        modelName: 'Employee',
        tableName: 'PERSON',
        underscore: true,
        timestamps: false
    });

    InvoiceHeader.removeAttribute('id');
    return Employee;
};