const database = require('../databases')['mssql_pat']
const { QueryTypes } = require('sequelize');

exports.getInvoicesByDate = async (startDate, endDate, employeeId = undefined, clientType = undefined, countryCode = undefined, db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = this.prepareBilledQuery(startDate, endDate, employeeId, clientType, countryCode);

            const data = await db.query(query.queryString,
                {
                    replacements: query.replacements,
                    type: QueryTypes.SELECT
                }
            );

            if (data) {
                let returnData = [];
                data.forEach(e => {
                    returnData.push({
                        invoiceDate: e['INVOCIE_DATE'],
                        actorId: e['ACTOR_ID'],
                        amount: e['AFFECT_AMOUNT']
                    });
                });
                resolve(returnData);
            }
            resolve(false);
        }
        catch (err) {
            const response = {
                status: err.status || 500,
                message: err.message || "Could not fetch invoices."
            };
            reject(response);
        }
    });
}

exports.prepareBilledQuery = (startDate, endDate, employeeId, clientType, countryCode) => {
    let query = {
        queryString: "SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
        replacements: [startDate, endDate]
    };

    let fromString = "FROM  BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH ";
    let whereString = "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%' ";

    if (employeeId !== undefined) {
        fromString = fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1",
            " AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID)",
            " LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1",
            " ON NQ1.NAME_ID=NC.NAME_ID",
            " AND NQ1.QUALITY_TYPE_ID=5 ");
        whereString = whereString.concat(" AND NQ1.DROPDOWN_CODE=? ");
        query.replacements.push(employeeId);
    }

    if (clientType !== undefined) {
        fromString = fromString.includes("LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID)") ?
            fromString : fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ");
        fromString = fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2 ",
            " ON NQ2.NAME_ID=NC.NAME_ID ",
            " AND NQ2.QUALITY_TYPE_ID=3 ");
        whereString = whereString.concat(" AND NQ2.DROPDOWN_CODE=? ");
        query.replacements.push(clientType.toUpperCase());
    }

    if (countryCode !== undefined) {
        fromString = fromString.includes("LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID)") ?
            fromString : fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ");
        fromString = fromString.concat(", [Bosco reduction].[dbo].NAME N ");
        whereString = whereString.concat(" AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? ");
        query.replacements.push(countryCode);
    }

    query.queryString = query.queryString.concat(fromString, whereString);

    return query;
}