const database = require('../databases')['mssql_bosco']
const databases = require('../databases');
const { QueryTypes } = require('sequelize');
const TransacStatModel = databases['mssql_bosco'].transactions_stat;

exports.getTransactionsStatByYearMonth = async (query, db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await db.query(query.queryString, {
                replacements: query.replacements,
                type: QueryTypes.SELECT
            });

            if (data) {
                let returnData = [];

                data.forEach(e => {
                    returnData.push({
                        dueCurrent: e['DUE_CURRENT'],
                        due1Month: e['DUE_1_MONTH'],
                        due2Month: e['DUE_2_MONTH'],
                        due3Month: e['DUE_3_MONTH'],
                        yearMonth: e['YEAR_MONTH']
                    });
                });
                resolve(returnData);
            }
            resolve(false);
        }
        catch (err) {
            const response = {
                status: err.status || 500,
                message: err.message || "Could not fetch transactions."
            };
            reject(response);
        }
    })
}

// exports.getTransactionsStatByYearMonthAndEmployee = async (yearMonthList, employeeId, db = database) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             /* NQ.QUALITY_TYPE_ID -> 5 = Client responsible*/
//             const data = await db.query(
//                 "SELECT \
//                 ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH \
//                 FROM \
//                 ACCOUNTING_CLIENT_STAT ACS, \
//                 NAME_CONNECTION NCS, \
//                 NAME_QUALITY NQ, \
//                 NAME RESP \
//                 WHERE \
//                 ACS.CONNECTION_ID=3 AND \
//                 ACS.YEAR_MONTH IN (?) AND \
//                 NCS.CONNECTION_ID=3 AND \
//                 NCS.CONNECTION_NAME_ID=CONVERT(nvarchar,ACS.ACC_NAME_ID) AND \
//                 NQ.NAME_ID=NCS.NAME_ID AND \
//                 NQ.QUALITY_TYPE_ID=5 AND \
//                 CONVERT(nvarchar,RESP.NAME_ID)=NQ.DROPDOWN_CODE \
//                 AND NQ.DROPDOWN_CODE = ?",
//                 {
//                     replacements: [yearMonthList, employeeId],
//                     type: QueryTypes.SELECT
//                 }
//             );
//             if (data) {
//                 let returnData = [];

//                 data.forEach(e => {
//                     returnData.push({
//                         dueCurrent: e['DUE_CURRENT'],
//                         due1Month: e['DUE_1_MONTH'],
//                         due2Month: e['DUE_2_MONTH'],
//                         due3Month: e['DUE_3_MONTH'],
//                         yearMonth: e['YEAR_MONTH']
//                     });
//                 });
//                 resolve(returnData);
//             }
//             resolve(false);
//         }
//         catch (err) {
//             reject(err);
//         }
//     });
// }

// exports.getTransactionsStatByYearMonthAndCountry = async (yearMonthList, countryLabel, db = database) => {
//     return new Promise(async (resolve, reject) => {

//         try{
//             const data = await db.query(
//                 "SELECT DUE_CURRENT, DUE_1_MONTH, DUE_2_MONTH, DUE_3_MONTH, YEAR_MONTH \
//                 FROM ACCOUNTING_CLIENT_STAT \
//                 WHERE ACC_NAME_ID IN (SELECT ACC_NAME_ID FROM ACCOUNTING_NAME WHERE ACC_NAME_COUNTRY = ?) \
//                 AND CONNECTION_ID = 3 \
//                 AND YEAR_MONTH IN (?)",
//                 {
//                     replacements: [countryLabel, yearMonthList],
//                     type: QueryTypes.SELECT
//                 }
//             );
//             if (data) {
//                 let returnData = [];

//                 data.forEach(e => {
//                     returnData.push({
//                         dueCurrent: e['DUE_CURRENT'],
//                         due1Month: e['DUE_1_MONTH'],
//                         due2Month: e['DUE_2_MONTH'],
//                         due3Month: e['DUE_3_MONTH'],
//                         yearMonth: e['YEAR_MONTH']
//                     });
//                 });
//                 resolve(returnData);
//             }
//             resolve(false);
//         }
//         catch(err){
//             reject(err);
//         }
//     });
// }


// exports.getTransactionsStatByYearMonthAndEmployeeAndCountry = async (yearMonthList, employeeId, countryLabel, db = database) => {
//     return new Promise(async (resolve, reject) => {

//         try{
//             const data = await db.query(
//                 "SELECT ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH \
//                 FROM ACCOUNTING_CLIENT_STAT ACS, NAME_CONNECTION NCS, \
//                 NAME_QUALITY NQ, NAME RESP \
//                 WHERE ACC_NAME_ID IN (SELECT ACC_NAME_ID FROM ACCOUNTING_NAME WHERE ACC_NAME_COUNTRY = ?) \
//                 AND ACS.CONNECTION_ID=3 \
//                 AND ACS.YEAR_MONTH IN (?) \
//                 AND NCS.CONNECTION_ID=3 \
//                 AND NCS.CONNECTION_NAME_ID=CONVERT(nvarchar,ACS.ACC_NAME_ID) \
//                 AND NQ.NAME_ID=NCS.NAME_ID \
//                 AND NQ.QUALITY_TYPE_ID=5 \
//                 AND CONVERT(nvarchar,RESP.NAME_ID)=NQ.DROPDOWN_CODE \
//                 AND NQ.DROPDOWN_CODE=?",
//                 {
//                     replacements: [countryLabel, yearMonthList, employeeId],
//                     type: QueryTypes.SELECT
//                 }
//             );
//             if (data) {
//                 let returnData = [];

//                 data.forEach(e => {
//                     returnData.push({
//                         dueCurrent: e['DUE_CURRENT'],
//                         due1Month: e['DUE_1_MONTH'],
//                         due2Month: e['DUE_2_MONTH'],
//                         due3Month: e['DUE_3_MONTH'],
//                         yearMonth: e['YEAR_MONTH']
//                     });
//                 });
//                 resolve(returnData);
//             }
//             resolve(false);
//         }
//         catch(err){
//             reject(err);
//         }
//     });
// }
