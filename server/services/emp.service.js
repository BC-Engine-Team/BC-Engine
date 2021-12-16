const databases = require("../data_access_layer/mysqldb");
const Employee = databases['mssql_pat'].employees;

exports.checkEmail = async (req, res, next) => {
    Employee.findOne({
        where: {
            email: req.body.email
        }
    }).then(async data => {
        console.log(data);
        if(data){
            req.emp = {};
            let empName = data.dataValues.firstName + " " + data.dataValues.lastName;
            req.emp.email = data.dataValues.email;
            req.emp.name = empName;
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