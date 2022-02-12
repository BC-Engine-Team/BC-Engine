const database = require('../databases')['mssql_bosco'];
const { QueryTypes } = require('sequelize');


exports.getClientGrading = async (clientIDList, db = database) => {

    return new Promise(async (resolve, reject) => {

        try {
            const data = await db.query(
                "SELECT DISTINCT [NAME_ID], [DROPDOWN_CODE] \
                FROM [Bosco reduction].[dbo].[NAME_QUALITY] WHERE QUALITY_TYPE_ID = 15 \
                AND NAME_ID IN (?)",
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
                        grading: c["DROPDOWN_CODE"]
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