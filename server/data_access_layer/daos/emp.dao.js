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