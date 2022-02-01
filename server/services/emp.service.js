const EmpDAO = require("../data_access_layer/daos/emp.dao");
const NameDAO = require("../data_access_layer/daos/name.dao");

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

exports.getAllEmployees = async () => {
    listEmployees = [];
    listEmployeesWithNameID = []

    return new Promise(async (resolve, reject) => {
        await EmpDAO.getAllEmployees()
            .then(async data => {
                if(data) {
                    listEmployees = data;
                }
                else {
                    resolve("Could not get all employees.");
                }
            })
            .catch(err => {
                reject(err);
            });

        await listEmployees.forEach(e => {
           NameDAO.getEmployeeByName(e.firstName, e.lastName)
                .then(async data => {
                    if(data) {
                        listEmployeesWithNameID.push(data.dataValues);
                        if(listEmployees.length === listEmployeesWithNameID.length) {
                            // Puts users in alphabetical order for the users table
                            let sortedList = listEmployeesWithNameID.sort((a, b) => {
                                a = a.firstName.concat(a.lastName)
                                b = b.firstName.concat(b.lastName)
                                let userA = a.toUpperCase();
                                let userB = b.toUpperCase();
                                return (userA < userB) ? -1 : (userA > userB) ? 1 : 0;
                            });
                            resolve(sortedList);
                        }
                    }
                    else {
                        resolve("Could not get all employees.");
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    });
}