const databases = require("../databases");
const database = require('../databases')['mssql_bosco'];
const { QueryTypes } = require('sequelize');
const NameModel = databases['mssql_bosco'].nameEmployee;

exports.getEmployeeByName = async (fName, lName, nameModel = NameModel) => {
    return new Promise((resolve, reject) => {
        nameModel.findOne({
            where: {
                NAME_1: fName,
                NAME_3: lName
            }
        })
        .then(async data => {
            if(data) resolve(data);
            resolve(false);
        })
        .catch(err => {
            const response = {
                status: err.status || 500,
                message: err.message || "some error occured"
            }
            reject(response);
        })
    })
}

exports.getClientByID = async (clientIDList, db=database) => {

    return new Promise(async (resolve, reject) => {

        try{
            const data = await db.query(
                "SELECT DISTINCT N.NAME_ID, ISNULL(N.NAME_1,'')+ISNULL(' '+N.NAME_2,'')+ISNULL(' '+N.NAME_3,'') as NAME, C.COUNTRY_LABEL \
                FROM NAME N, NAME_CONNECTION NC, COUNTRY C \
                WHERE NC.CONNECTION_NAME_ID in (?) \
                AND NC.NAME_ID = N.NAME_ID \
                AND N.LEGAL_COUNTRY_CODE = C.COUNTRY_CODE",
                {
                    replacements: [clientIDList],
                    type: QueryTypes.SELECT
                }
            );
            if(data){
                let returnData = [];
                data.forEach(c => {
                    returnData.push({
                        nameId: c["NAME_ID"],
                        name: c["NAME"],
                        country: c["COUNTRY_LABEL"]
                    });
                });
                resolve(returnData);
            }
            resolve(false);
        }
        catch(err){
            reject(err);
        }
    });
}


exports.getClientByIDAndCountry = async (clientIDList, countryCode, db=database) => {
    return new Promise(async (resolve, reject) => {
        try{
            const data = await db.query(
                "SELECT DISTINCT N.NAME_ID, ISNULL(N.NAME_1,'')+ISNULL(' '+N.NAME_2,'')+ISNULL(' '+N.NAME_3,'') as NAME, C.COUNTRY_LABEL, C.COUNTRY_CODE \
                FROM NAME N, NAME_CONNECTION NC, COUNTRY C \
                WHERE NC.CONNECTION_NAME_ID in (?) \
                AND NC.NAME_ID = N.NAME_ID \
                AND N.LEGAL_COUNTRY_CODE = C.COUNTRY_CODE \
                AND C.COUNTRY_LABEL = ?",
                {
                    replacements: [clientIDList, countryCode],
                    type: QueryTypes.SELECT
                }
            );
            if(data){
                let returnData = [];
                data.forEach(c => {
                    returnData.push({
                        nameId: c["NAME_ID"],
                        name: c["NAME"],
                        country: c["COUNTRY_LABEL"]
                    });
                });
                resolve(returnData);
            }
            resolve(false);
        }
        catch(err){
            reject(err);
        }
    });
}