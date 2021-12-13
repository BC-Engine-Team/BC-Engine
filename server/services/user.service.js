const mysqldb = require("../data_access_layer/mysqldb");
const User = mysqldb.users;
const Op = mysqldb.Sequelize.Op;

exports.createUser = async (user) => {
    return new Promise((resolve, reject) => {
        console.log(user);
        User.create(user)
            .then(async data => {
                console.log("in User model promise" + data.dataValues);
                if(data) resolve(data.dataValues);
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: 500,
                    data: {},
                    error: {
                        message: err.message || "some error occured"
                    }
                }
                reject(response);
            });
    });
    
};

exports.getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        User.findAll()
            .then(async data => {
                if(data) resolve(data);
                resolve(false);
            })
            .catch(err =>{
                const response = {
                    status: 500,
                    data: {},
                    error: {
                        message: err.message || "some error occured"
                    }
                }
                reject(response);
            });
    });
};

exports.getAdmins = async () => {
    return new Promise((resolve, reject) => {
        User.findAll({
            where: {
                role: 'admin'
            }
        })
        .then(async data => {
            if(data) resolve(data);
            resolve(false);
        })
        .catch(err =>{
            const response = {
                status: 500,
                data: {},
                error: {
                    message: err.message || "some error occured"
                }
            }
            reject(response);
        });
    });
};

exports.authenticateUser = async (user) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                user_email: user.email
            }
        })
        .then(async data => {
            if(!data){
                resolve(false);
            } else{
                if(!data.dataValues.password ||
                    !await data.validPassword(user.password, data.dataValues.password)){
                        resolve(false);
                } else {
                    resolve(data.dataValues);
                }
            }
        })
        .catch(err =>{
            const response = {
                status: 500,
                data: {},
                error: {
                    message: err.message || "some error occured"
                }
            }
            reject(response);
        });
    });
};