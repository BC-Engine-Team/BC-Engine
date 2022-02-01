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
            field: 'INVOCIE_DATE',
            type: DataTypes.DATEONLY
        },
        invoiceType: {
            field: 'INVOICE_TYPE',
            type: DataTypes.INTEGER
        },
        clientResponsibleId: {
            field: 'CLIENT_RESPONSIBLE_ID',
            type: DataTypes.INTEGER
        },
        foreignCurrencyValue: {
            field: 'FOREIGN_CURR_VALUE',
            type: DataTypes.DECIMAL(14,2)
        }
    },
    {
        modelName: 'InvoiceHeader',
        tableName: 'INVOICE_HEADER',
        underscore: true,
        timestamps: false
    });

    InvoiceHeader.removeAttribute('id');
    return InvoiceHeader;
};