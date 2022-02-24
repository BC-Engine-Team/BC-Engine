const database = require('../databases')['mssql_bosco'];
const { QueryTypes } = require('sequelize');

exports.getClientsInClientIdList = async (clientIDList, db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            let queryString = "".concat("SELECT DISTINCT N.NAME_ID, ISNULL(N.NAME_1,'')+ISNULL(' '+N.NAME_2,'')+ISNULL(' '+N.NAME_3,'') as NAME, C.COUNTRY_LABEL, NQ.DROPDOWN_CODE as 'GRADING'",
                " FROM NAME N LEFT OUTER JOIN NAME_QUALITY NQ ON NQ.NAME_ID=N.NAME_ID AND NQ.QUALITY_TYPE_ID=15, COUNTRY C, NAME_CONNECTION NC",
                " WHERE C.COUNTRY_CODE=N.LEGAL_COUNTRY_CODE AND NC.CONNECTION_NAME_ID IN (?) AND NC.NAME_ID=N.NAME_ID ORDER BY NAME");

            const data = await db.query(queryString,
                {
                    replacements: [clientIDList],
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
                        grading: c["GRADING"] === null ? "N/A" : c["GRADING"]
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

exports.getAllEmployeeNames = async (db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await db.query(
                "SELECT ISNULL(NAME_1,'') + ISNULL(' '+NAME_2,'') + ISNULL(' '+NAME_3,'') AS FULLNAME, NAME_ID \
                FROM NAME \
                WHERE NAME_ID IN \
                ( SELECT DISTINCT DROPDOWN_CODE FROM NAME_QUALITY \
                WHERE DROPDOWN_ID = 5 ) \
                ORDER BY NAME_1",
                {
                    type: QueryTypes.SELECT
                }
            );
            if (data) {
                let returnData = [];
                data.forEach(c => {
                    returnData.push({
                        nameID: c["NAME_ID"],
                        name: c["FULLNAME"],
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







exports.getNameIDAndAffectAmount = async (db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            let selectQueryString = "SELECT IH.INVOCIE_DATE, NC.CONNECTION_NAME_ID, BIA.AFFECT_AMOUNT, NQ.DROPDOWN_CODE, NC.NAME_ID, DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION) AS DATE_SINCE_LAST_TRANSACTION \
                                    FROM [Patricia reduction].[dbo].[BOSCO_INVOICE_AFFECT] BIA, [Patricia reduction].[dbo].[INVOICE_HEADER] IH \
                                    LEFT OUTER JOIN [Bosco reduction].[dbo].[NAME_CONNECTION] NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) \
                                    LEFT OUTER JOIN [Bosco reduction].[dbo].[ACCOUNTING_CLIENT] AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) \
                                    LEFT OUTER JOIN [Bosco reduction].[dbo].[NAME_QUALITY] NQ ON NQ.NAME_ID=NC.NAME_ID AND NQ.DROPDOWN_ID = 15 \
                                    WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN '2019-11-01' AND '2020-11-01' \
                                    AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'"

            const data = await db.query(selectQueryString,
                {
                    type: QueryTypes.SELECT
                }
            );
            if (data)
            {
                let returnData = [];
                data.forEach(c => {
                    returnData.push({
                        nameId: c["NAME_ID"],
                        affectAmount: c["AFFECT_AMOUNT"],
                        daysToPay: c["DATE_SINCE_LAST_TRANSACTION"]
                    });
                });
                resolve(returnData);
            }
            resolve(false);
        }
        catch (err) {
            const response = {
                status: err.status || 500,
                message: err.message || "Could not fetch any informations."
            };
            reject(response);
        }
    });
}

exports.changeClientGradingToAPlus = async (listOfClientsWithGradeAPlus, db = database) => {
    return new Promise(async (resolve, reject) => {
        try{

            let updateQueryString = "UPDATE [Bosco reduction].[dbo].[NAME_QUALITY] SET DROPDOWN_CODE = 'A+' \
                                    WHERE [Bosco reduction].[dbo].[NAME_QUALITY].[QUALITY_TYPE_ID] = 15 \
                                    AND [Bosco reduction].[dbo].[NAME_QUALITY].[NAME_ID] IN (?)";


            const data = await db.query(updateQueryString,
                {
                    replacements: [listOfClientsWithGradeAPlus],
                    type: QueryTypes.UPDATE
                }
            );
            if (data)
            {
                let returnData = "Modified client gradings successfully";
                resolve(returnData);
            }
            resolve(false);
        }
        catch (err) {
            const response = {
                status: err.status || 500,
                message: err.message || "Could not modify any gradings."
            };
            reject(response);
        }
    });
}

exports.changeClientGradingToA = async (listOfClientsWithGradeA, db = database) => {
    return new Promise(async (resolve, reject) => {
        try{

            let updateQueryString = "UPDATE [Bosco reduction].[dbo].[NAME_QUALITY] SET DROPDOWN_CODE = 'A' \
                                    WHERE [Bosco reduction].[dbo].[NAME_QUALITY].[QUALITY_TYPE_ID] = 15 \
                                    AND [Bosco reduction].[dbo].[NAME_QUALITY].[NAME_ID] IN (?)";


            const data = await db.query(updateQueryString,
                {
                    replacements: [listOfClientsWithGradeA],
                    type: QueryTypes.UPDATE
                }
            );
            if (data)
            {
                let returnData = "Modified client gradings successfully";
                resolve(returnData);
            }
            resolve(false);
        }
        catch (err) {
            const response = {
                status: err.status || 500,
                message: err.message || "Could not modify any gradings."
            };
            reject(response);
        }
    });
}

exports.changeClientGradingToB = async (listOfClientsWithGradeB, db = database) => {
    return new Promise(async (resolve, reject) => {
        try{

            let updateQueryString = "UPDATE [Bosco reduction].[dbo].[NAME_QUALITY] SET DROPDOWN_CODE = 'B' \
                                    WHERE [Bosco reduction].[dbo].[NAME_QUALITY].[QUALITY_TYPE_ID] = 15 \
                                    AND [Bosco reduction].[dbo].[NAME_QUALITY].[NAME_ID] IN (?)";


            const data = await db.query(updateQueryString,
                {
                    replacements: [listOfClientsWithGradeB],
                    type: QueryTypes.UPDATE
                }
            );
            if (data)
            {
                let returnData = "Modified client gradings successfully";
                resolve(returnData);
            }
            resolve(false);
        }
        catch (err) {
            const response = {
                status: err.status || 500,
                message: err.message || "Could not modify any gradings."
            };
            reject(response);
        }
    });
}

exports.changeClientGradingToC = async (listOfClientsWithGradeC, db = database) => {
    return new Promise(async (resolve, reject) => {
        try{

            let updateQueryString = "UPDATE [Bosco reduction].[dbo].[NAME_QUALITY] SET DROPDOWN_CODE = 'C' \
                                    WHERE [Bosco reduction].[dbo].[NAME_QUALITY].[QUALITY_TYPE_ID] = 15 \
                                    AND [Bosco reduction].[dbo].[NAME_QUALITY].[NAME_ID] IN (?)";


            const data = await db.query(updateQueryString,
                {
                    replacements: [listOfClientsWithGradeC],
                    type: QueryTypes.UPDATE
                }
            );
            if (data)
            {
                let returnData = "Modified client gradings successfully";
                resolve(returnData);
            }
            resolve(false);
        }
        catch (err) {
            const response = {
                status: err.status || 500,
                message: err.message || "Could not modify any gradings."
            };
            reject(response);
        }
    });
}


exports.changeClientGradingToEPlus = async (listOfClientsWithGradeEPlus, db = database) => {
    return new Promise(async (resolve, reject) => {
        try{

            let updateQueryString = "UPDATE [Bosco reduction].[dbo].[NAME_QUALITY] SET DROPDOWN_CODE = 'E+' \
                                    WHERE [Bosco reduction].[dbo].[NAME_QUALITY].[QUALITY_TYPE_ID] = 15 \
                                    AND [Bosco reduction].[dbo].[NAME_QUALITY].[NAME_ID] IN (?)";


            const data = await db.query(updateQueryString,
                {
                    replacements: [listOfClientsWithGradeEPlus],
                    type: QueryTypes.UPDATE
                }
            );
            if (data)
            {
                let returnData = "Modified client gradings successfully";
                resolve(returnData);
            }
            resolve(false);
        }
        catch (err) {
            const response = {
                status: err.status || 500,
                message: err.message || "Could not modify any gradings."
            };
            reject(response);
        }
    });
}