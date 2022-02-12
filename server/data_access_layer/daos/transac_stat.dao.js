const database = require('../databases')['mssql_bosco']
const databases = require('../databases');
const { QueryTypes } = require('sequelize');
const TransacStatModel = databases['mssql_bosco'].transactions_stat;

exports.getTransactionsStatByYearMonth = async (yearMonthList, clientType = undefined, db = database) => {
    return new Promise(async (resolve, reject) => {

        try {
            let queryStringSelect = "select ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH";

            let queryStringFrom = " from ACCOUNTING_CLIENT_STAT ACS ";

            let queryStringWhere = " where ACS.YEAR_MONTH in (?) \
            and ACS.CONNECTION_ID = 3 \
            and ACS.STAT_TYPE = 1 ";

            let replacements = [yearMonthList];

            if (clientType !== undefined) {
                queryStringFrom += ", NAME_CONNECTION NC, NAME_QUALITY NQ ";

                queryStringWhere += " and NC.CONNECTION_ID = 3\
                and NC.CONNECTION_NAME_ID = CONVERT(NVARCHAR, ACS.ACC_NAME_ID)\
                and NC.NAME_ID = NQ.NAME_ID\
                and NQ.QUALITY_TYPE_ID = 3\
                and NQ.DROPDOWN_CODE = ?";

                replacements.push(clientType.toUpperCase());
            }

            let queryString = queryStringSelect + queryStringFrom + queryStringWhere;

            const data = await db.query(queryString, {
                replacements: replacements,
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

exports.getTransactionsStatByYearMonthAndEmployee = async (yearMonthList, employeeId, db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            /* NQ.QUALITY_TYPE_ID -> 5 = Client responsible*/
            const data = await db.query(
                "Select \
                ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH \
                from \
                ACCOUNTING_CLIENT_STAT ACS, \
                NAME_CONNECTION NCS, \
                NAME_QUALITY NQ, \
                NAME RESP \
                Where \
                ACS.CONNECTION_ID=3 AND \
                ACS.YEAR_MONTH IN (?) AND \
                NCS.CONNECTION_ID=3 AND \
                NCS.CONNECTION_NAME_ID=CONVERT(nvarchar,ACS.ACC_NAME_ID) AND \
                NQ.NAME_ID=NCS.NAME_ID AND \
                NQ.QUALITY_TYPE_ID=5 AND \
                CONVERT(nvarchar,RESP.NAME_ID)=NQ.DROPDOWN_CODE \
                AND NQ.DROPDOWN_CODE = ?",
                {
                    replacements: [yearMonthList, employeeId],
                    type: QueryTypes.SELECT
                }
            );
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
            reject(err);
        }
    });
}