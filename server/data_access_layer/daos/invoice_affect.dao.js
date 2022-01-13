const database = require('../databases')['mssql_pat']
const InvoiceAffectModel = database.invoice_affect;
const { Op, QueryTypes } = require('sequelize');


exports.getInvoicesByDate = async (startDate, endDate, invoiceAffectModel = InvoiceAffectModel) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await database.query(
                "select sum(affect_amount) from BOSCO_INVOICE_AFFECT\
                where AFFECT_ACCOUNT = '1200'\
                and AFFECT_AMOUNT > 0\
                and INVOICE_ID in (select INVOICE_ID from INVOICE_HEADER\
                where INVOCIE_DATE < '2020-11-01'\
                and INVOCIE_DATE >= '2019-11-01')",
                { type: QueryTypes.SELECT }
            );
            resolve(data[0]['']);
        }
        catch (err) {
            reject(err);
        }
    });
}