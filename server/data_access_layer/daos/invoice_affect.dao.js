const database = require('../databases')['mssql_pat']
const InvoiceAffectModel = database.invoice_affect;
const { Op, QueryTypes } = require('sequelize');


exports.getInvoicesByDate = async (startDate, endDate, invoiceAffectModel = InvoiceAffectModel) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await database.query(
                "Select IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT \
                from INVOICE_HEADER IH, BOSCO_INVOICE_AFFECT BIA \
                Where IH.INVOICE_PREVIEW=0 \
                AND IH.INVOICE_TYPE in (1,4) \
                AND IH.INVOCIE_DATE between ? AND ? \
                AND BIA.INVOICE_ID=IH.INVOICE_ID \
                AND BIA.AFFECT_ACCOUNT like '%1200%'",
                {
                    replacements: [startDate, endDate],
                    type: QueryTypes.SELECT
                }
            );
            if (data) resolve(data);
            reject(false);
        }
        catch (err) {
            reject(err);
        }
    });
}