const database = require('../databases')['mssql_pat']
const InvoiceHeaderModel = database.invoice_header;
const { Op, QueryTypes } = require('sequelize');


exports.getInvoicesByDate = async (startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await database.query(
                "select INVOCIE_DATE, FOREIGN_CURR_VALUE from INVOICE_HEADER\
                where INVOICE_ID in (select INVOICE_ID from BOSCO_INVOICE_AFFECT\
                where AFFECT_ACCOUNT = '1200'\
                and AFFECT_AMOUNT > 0)\
                and INVOCIE_DATE < '2020-11-01'\
                and INVOCIE_DATE >= '2018-12-01'",
                { type: QueryTypes.SELECT }
            );
            resolve(data);
        }
        catch (err) {
            reject(err);
        }
    });
}