const mysqldb = require("../data_access_layer/mysqldb");
const User = mysqldb['mysqldb'].users;
const Op = mysqldb.Sequelize.Op;

exports.createUser = async (user) => {
    return new Promise((resolve, reject) => {
        User.create(user)
            .then(async data => {
                if(data) {
                    let returnData = {
                        email: data.dataValues.email,
                        name: data.dataValues.name,
                        role: data.dataValues.role
                    };
                    
                    resolve(returnData);
                }
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: 500,
                    data: {},
                    message: err.message || "some error occured" 
                }
                reject(response);
            });
    });
    
};

exports.getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        User.findAll()
            .then(async data => {
                if(data){
                    let returnData = [];
                    for(let u=0; u<data.length;u++){
                        returnData.push({
                            email: data[u].dataValues.email,
                            name: data[u].dataValues.name,
                            role: data[u].dataValues.role
                        });
                    }
                    resolve(returnData);
                } 
                resolve(false);
            })
            .catch(err =>{
                const response = {
                    status: 500,
                    data: {},
                    message: err.message || "some error occured"
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
            if(data){
                let returnData = [];
                for(let u=0; u<data.length;u++){
                    returnData.push({
                        email: data[u].dataValues.email,
                        name: data[u].dataValues.name,
                        role: data[u].dataValues.role
                    });
                }
                resolve(returnData);
            } 
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
                if(!data.password ||
                    !await data.validPassword(user.password, data.password)){
                        resolve(false);
                } else {
                    resolve(data);
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