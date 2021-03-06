const database = require('../databases')['mssql_pat']
const { QueryTypes } = require('sequelize');

exports.findAllClients = async (date, db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            let queryString = "".concat(
                "SELECT DISTINCT NC.NAME_ID,",
                " ISNULL(N.NAME_1,'')+ISNULL(' '+N.NAME_2,'')+ISNULL(' '+N.NAME_3,'') as NAME,",
                " C.COUNTRY_LABEL,",
                " NQ.DROPDOWN_CODE",
                " FROM BOSCO_INVOICE_AFFECT BIA,",
                " [Bosco reduction].[dbo].NAME N",
                " LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ ON NQ.NAME_ID=N.NAME_ID AND NQ.QUALITY_TYPE_ID=15,",
                " [Bosco reduction].[dbo].COUNTRY C,",
                " INVOICE_HEADER IH",
                " LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID)",
                " LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID)",
                " WHERE IH.INVOICE_TYPE in (1,4)",
                " AND IH.INVOICE_PREVIEW=0",
                " AND IH.INVOCIE_DATE > ?",
                " AND BIA.INVOICE_ID=IH.INVOICE_ID",
                " AND BIA.AFFECT_ACCOUNT LIKE '%1200%'",
                " AND NQ.DROPDOWN_CODE IS NOT NULL",
                " AND C.COUNTRY_CODE=N.LEGAL_COUNTRY_CODE",
                " AND NC.NAME_ID=N.NAME_ID ORDER BY NAME");

            const data = await db.query(queryString,
                {
                    replacements: [date],
                    type: QueryTypes.SELECT
                }
            );
            if (data) {
                let returnData = [];
                data.forEach(c => {
                    returnData.push({
                        nameId: c["NAME_ID"],
                        name: c["NAME"],
                        country: c["COUNTRY_LABEL"],
                        grading: c["DROPDOWN_CODE"]
                    });
                });
                resolve(returnData);
            }
            resolve(false);
        }
        catch (err) {
            const response = {
                status: err.status || 500,
                message: err.message || "Could not fetch clients."
            };
            reject(response);
        }
    });
}

exports.getInvoicesByDate = async (startDate, endDate, employeeId = undefined, clientType = undefined, countryCode = undefined, ageOfAccount = undefined, accountType = undefined, db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = this.prepareBilledQuery(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, accountType);

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

exports.prepareBilledQuery = (startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, accountType) => {
    let query = {
        queryString: "SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
        replacements: [startDate, endDate]
    };

    let fromString = "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH ";
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

    if (ageOfAccount !== undefined) {
        fromString = fromString.includes("LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID)") ?
            fromString : fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ");
        fromString = fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ");

        switch (ageOfAccount) {
            case "<30":
                whereString = whereString.concat(" AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)<30 ");
                break;
            case "30-60":
                whereString = whereString.concat(" AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)>=30",
                                                 " AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)<60 ");
                break;
            case "60-90":
                whereString = whereString.concat(" AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)>=60",
                                                 " AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)<=90 ");
                break;
            case ">90":
                whereString = whereString.concat(" AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)>90 ");
                break;
        }
    }

    if (countryCode !== undefined) {
        fromString = fromString.includes("LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID)") ?
            fromString : fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ");

        fromString = fromString.includes("LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID)") ?
            fromString : fromString = fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ");

        fromString = fromString.concat(", [Bosco reduction].[dbo].NAME N ");
        whereString = whereString.concat(" AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? ");
        query.replacements.push(countryCode);
    }

    // account Type Payables
    if(accountType !== undefined) {
        
        // base query replacements
        query.queryString = "SELECT AC.TRANSACTION_DATE AS INVOCIE_DATE, IH.ACTOR_ID, AC.TRANSACTION_AMOUNT AS AFFECT_AMOUNT ";

        fromString = fromString.replace("FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH", 
                           "FROM [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC, [Patricia reduction].[dbo].EXTERNAL_COSTS_HEAD IH");

        whereString = whereString.replace("WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'",
                            "WHERE AC.CONNECTION_ID=7 AND AC.TRANSACTION_TYPE_ID=0 AND AC.TRANSACTION_DATE BETWEEN ? AND ? AND AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.EXTERNAL_INVOICE_REMARK)")
    
        // ageOfAccount query replacements
        if (ageOfAccount !== undefined) {
            fromString = fromString.replace(" LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ", "")

            whereString = whereString.replaceAll("IH.INVOCIE_DATE", "AC.TRANSACTION_DATE")
        }

        // country query replacements
        if(countryCode !== undefined) {
            fromString = fromString.includes(" LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ") ?
                fromString.replace(" LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ", "") : fromString
        }  
    }
    
    query.queryString = query.queryString.concat(fromString, whereString);

    return query;
}