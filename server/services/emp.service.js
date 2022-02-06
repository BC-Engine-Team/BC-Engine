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
        let listEmployeesWithNameID = [];
        let listEmployees = [];

        await this.getAllEmployeeNames().then(async data => {
            listEmployees = data;
        }).catch(err => {
            reject(err);
        });

        for(let i = 0; i < listEmployees.length; i++) {
            await this.getEmployeeByfNameAndlName(listEmployees[i].firstName, listEmployees[i].lastName).then(async data => {
                if(data) {
                    listEmployeesWithNameID.push(data);

                    if(listEmployees.length === listEmployeesWithNameID.length) {
                        resolve(await this.sortListAlphabetically(listEmployeesWithNameID));
                    }
                }
                else {
                    resolve(false);
                }
                
            }).catch(err => {
                reject(err);
            });
        }
    });
}

exports.getEmployeeByfNameAndlName = async (firstName, lastName) => {
    return new Promise(async (resolve, reject) => {
        await NameDAO.getEmployeeByName(firstName, lastName)
            .then(async data => {
                if(data) {
                    resolve(data.dataValues);
                }
                resolve(false);
            })
            .catch(err => {
                reject(err);
            });
    });
}

exports.getAllEmployeeNames = async () => {
    return new Promise(async (resolve, reject) => {
        await EmpDAO.getAllEmployees()
        .then(async data => {
            if(data) {
                resolve(data);
            }
            resolve(false);
        })
        .catch(err => {
            reject(err);
        });
    });
}

exports.sortListAlphabetically = (list) => {
    let sortedList = list.sort((a, b) => {
        a = a.firstName.concat(a.lastName)
        b = b.firstName.concat(b.lastName)
        let userA = a.toUpperCase();
        let userB = b.toUpperCase();
        return (userA < userB) ? -1 : (userA > userB) ? 1 : 0;
    });

    return sortedList;
}