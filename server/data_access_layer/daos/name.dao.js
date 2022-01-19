const { Op } = require("sequelize");
const databases = require("../databases");
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
                status: 500,
                data: {},
                message: err.message || "some error occured"
            }
            reject(response);
        })
    })
}