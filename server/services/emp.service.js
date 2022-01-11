const EmpDAO = require("../data_access_layer/daos/emp.dao");

exports.checkEmail = async (req, res, next) => {
    EmpDAO.getEmployeeByEmail(req.body.email).then(async data => {
        if(data){
            req.emp = data;
            return next()
        }
        const response = {
            status: 400,
            data: {},
            message: "Employee email doesn't exist."
        }
        return res.status(400).send(response);
    })
    .catch(err => {
        const response = {
            status: 500,
            data: {},
            message: err.message || "some error occured"
        }
        return res.status(500).send(response);
    })
    
};