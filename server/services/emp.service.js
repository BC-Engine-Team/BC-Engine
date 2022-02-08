const EmpDAO = require("../data_access_layer/daos/emp.dao");
const NameDAO = require("../data_access_layer/daos/name.dao");

exports.checkEmail = async (req, res, next) => {
    EmpDAO.getEmployeeByEmail(req.body.email).then(async data => {
        if(data) {
            req.emp = data;
            return next()
        }
        const response = {
            status: 400,
            message: "Employee email doesn't exist."
        }
        return res.status(400).send(response);
    })
    .catch(err => {
        const response = {
            status: 500,
            message: err.message || "some error occured"
        }
        return res.status(500).send(response);
    })
    
};

exports.getAllEmployees = async () => {
    return new Promise(async (resolve, reject) => {
        await NameDAO.getAllEmployeeNames().then(async data => {
            if(data) {
                resolve(data);
            }
            resolve(false);
        }).catch(err => {
            reject(err);
        });
    });
}