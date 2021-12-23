const EmployeeModel = require('../models/mssql_pat/employee.model');

exports.getEmployeeByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        EmployeeModel.findOne({
            where: {
                email: email
            }
        }).then(async data => {
            if(data) resolve(data)
            resolve(false);
        }).catch(err => {
            const response = {
                status: 500,
                data: {},
                message: err.message || "some error occured"
            }
            reject(response);
        });
    });
}