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
            reject(err);
        }
    });
}