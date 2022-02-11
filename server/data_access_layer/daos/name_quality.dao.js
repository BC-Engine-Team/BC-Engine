const database = require('../databases')['mssql_bosco']
const { QueryTypes } = require('sequelize');

exports.getClientsByEmployee = async (employeeId, db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await db.query(
                "Select NC.CONNECTION_NAME_ID \
                from NAME_QUALITY NQ, NAME_CONNECTION NC \
                Where NC.NAME_ID = NQ.NAME_ID \
                AND NQ.QUALITY_TYPE_ID = 5 \
                AND NC.CONNECTION_ID = 1 \
                AND NQ.DROPDOWN_CODE = ?",
                {
                    replacements: [employeeId],
                    type: QueryTypes.SELECT
                }
            );
            if (data) {
                let returnData = [];
                data.forEach(e => {
                    returnData.push(e['CONNECTION_NAME_ID']);
                });
                resolve(returnData);
            }
            resolve(false);
        }
        catch (err) {
            const response = {
                status: err.status || 500,
                message: err.message || "some error occured"
            }
            reject(response);
        }
    });
}

// exports.getClientsByEmployeeAndCountry = async (employeeId, countrySymbol, db = database) => {
//     return new Promise(async (resolve, reject) => {
//         try{

//             const data = await db.query(
//                 "SELECT DISTINCT NC.CONNECTION_NAME_ID, N.LEGAL_COUNTRY_CODE, C.COUNTRY_LABEL \
//                 FROM [Bosco reduction].[dbo].[Name] N, [Bosco reduction].[dbo].[NAME_CONNECTION] NC, [Bosco reduction].[dbo].[NAME_QUALITY] NQ, [Bosco reduction].[dbo].[COUNTRY] C \
//                 WHERE convert(NVARCHAR,N.NAME_ID) = convert(NVARCHAR, NC.NAME_ID) \
//                 AND N.LEGAL_COUNTRY_CODE = ? \
//                 AND C.COUNTRY_CODE = N.LEGAL_COUNTRY_CODE \
//                 AND NQ.DROPDOWN_CODE = ?",
//                 {
//                     replacements: [countrySymbol, employeeId],
//                     type: QueryTypes.SELECT
//                 }
//             );
//             if (data) {
//                 let returnData = [];
//                 data.forEach(e => {
//                     returnData.push(e['CONNECTION_NAME_ID']);
//                 });
//                 resolve(returnData);
//             }
//             resolve(false);
//         }
//         catch (err) {
//             const response = {
//                 status: err.status || 500,
//                 message: err.message || "some error occured"
//             }
//             reject(response);
//         }
//     });
// }