const database = require('../databases')['mssql_pat']
const { QueryTypes } = require('sequelize');

exports.getInvoicesByDate = async (startDate, endDate, db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            const data = await db.query(
                "Select IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT \
                from [Patricia reduction].[dbo].[INVOICE_HEADER] IH, [Patricia reduction].[dbo].[BOSCO_INVOICE_AFFECT] BIA\
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
            reject(err);
        }
    });
}

exports.getInvoicesByDateAndEmployee = async (startDate, endDate, clientList, db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await db.query(
                "Select IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT \
                from INVOICE_HEADER IH, BOSCO_INVOICE_AFFECT BIA \
                Where IH.INVOICE_PREVIEW=0 \
                AND IH.INVOICE_TYPE in (1,4) \
                AND IH.INVOCIE_DATE between ? AND ? \
                AND BIA.INVOICE_ID=IH.INVOICE_ID \
                AND BIA.AFFECT_ACCOUNT like '%1200%'\
                AND convert(NVARCHAR, IH.ACTOR_ID) IN (?)",
                {
                    replacements: [startDate, endDate, clientList],
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
            reject(err);
        }
    });
}


exports.getInvoicesByDateAndCountry = async (startDate, endDate, countryCode, db = database) => {
    return new Promise(async (resolve, reject) => {
        try{
            const data = await db.query(
                "Select IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT, C.COUNTRY_LABEL \
                from [Patricia reduction].[dbo].[INVOICE_HEADER] IH, [Patricia reduction].[dbo].[BOSCO_INVOICE_AFFECT] BIA, [Bosco reduction].[dbo].[COUNTRY] C  \
                Where IH.INVOICE_PREVIEW=0 \
                AND IH.INVOICE_TYPE in (1,4) \
                AND IH.INVOCIE_DATE between ? AND ? \
                AND BIA.INVOICE_ID=IH.INVOICE_ID \
                AND BIA.AFFECT_ACCOUNT like '%1200%' \
                AND C.COUNTRY_LABEL = ?",
                {
                    replacements: [startDate, endDate, countryCode],
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
            reject(err);
        }
    });
}


exports.getInvoicesByDateAndEmployeeAndCountry = async (startDate, endDate, clientList, countryCode, db = database) => {
    return new Promise(async (resolve, reject) => {
        try{
            const data = await db.query(
                "Select IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT, C.COUNTRY_LABEL \
                from [Patricia reduction].[dbo].[INVOICE_HEADER] IH, [Patricia reduction].[dbo].[BOSCO_INVOICE_AFFECT] BIA, [Bosco reduction].[dbo].[COUNTRY] C \
                Where IH.INVOICE_PREVIEW=0 \
                AND IH.INVOICE_TYPE in (1,4) \
                AND IH.INVOCIE_DATE between ? AND ? AND BIA.INVOICE_ID=IH.INVOICE_ID \
                AND BIA.AFFECT_ACCOUNT like '%1200%' AND convert(NVARCHAR, IH.ACTOR_ID) IN (?) AND C.COUNTRY_LABEL=?",
                {
                    replacements: [startDate, endDate, clientList, countryCode],
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
            reject(err);
        }

    });
}