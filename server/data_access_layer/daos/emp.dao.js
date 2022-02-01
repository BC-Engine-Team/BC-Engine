const { Op } = require("sequelize");
const databases = require("../databases");
const EmployeeModel = databases['mssql_pat'].employees;

exports.getEmployeeByEmail = async (email, empModel = EmployeeModel) => {
    return new Promise((resolve, reject) => {
        empModel.findOne({
            where: {
                email: email
            }
        }).then(async data => {
            if(data){
                let emp = {};
                emp.email = data.dataValues.email;
                emp.name = data.dataValues.firstName + " " + data.dataValues.lastName;
                resolve(emp);
            }
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

exports.getAllEmployees = async (empModel = EmployeeModel) => {
    return new Promise((resolve, reject) => {
        empModel.findAll({
            where: {
                email: {
                    [Op.ne]: null
                },
                isActive: 1,
                firstName: {
                    [Op.ne]: "xx"
                }
            }
        })
        .then(async data => {
            if(data) {
                let returnDAta = [];
                for(let e = 0; e < data.length; e++) {
                    returnDAta.push({
                        email: data[e].dataValues.email,
                        firstName: data[e].dataValues.firstName,
                        lastName: data[e].dataValues.lastName,
                        isActive: data[e].dataValues.isActive
                    });
                }
                resolve(returnDAta);
            }
            resolve(false);
        })
        .catch(err => {
            const response = {
                status: err.status || 500,
                message: err.message || "some error occured"
            }
            reject(response);
        });
    });
}