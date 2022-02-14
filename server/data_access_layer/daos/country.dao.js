const database = require('../databases')['mssql_bosco'];
const { QueryTypes } = require('sequelize');


exports.getAllCountries = async (db = database) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await db.query(
                "SELECT DISTINCT C.[COUNTRY_CODE], \
                C.[COUNTRY_LABEL] \
                FROM [Bosco reduction].[dbo].[COUNTRY] C, [Bosco reduction].[dbo].[COUNTRY_SUB] P \
                WHERE C.[COUNTRY_LABEL] NOT IN (SELECT [SUB_COUNTRY_LABEL] FROM [Bosco reduction].[dbo].[COUNTRY_SUB]) \
                AND C.[COUNTRY_CODE] != '**' \
                AND C.[COUNTRY_CODE] != '++' AND C.[COUNTRY_CODE] != 'A5' \
                AND C.[COUNTRY_CODE] != 'A9' AND C.[COUNTRY_CODE] != 'AP' \
                AND C.[COUNTRY_CODE] != 'W5' AND C.[COUNTRY_CODE] != 'WE' \
                AND C.[COUNTRY_CODE] != 'WO' AND C.[COUNTRY_CODE] != 'XX' \
                AND C.[COUNTRY_CODE] != 'YY' AND C.[COUNTRY_CODE] != 'ZZ' \
                ORDER BY C.[COUNTRY_LABEL]",
                {
                    type: QueryTypes.SELECT
                }
            );

            if (data) {
                let returnData = [];
                data.forEach(c => {
                    returnData.push({
                        countryCode: c["COUNTRY_CODE"],
                        countryLabel: c["COUNTRY_LABEL"]
                    });
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