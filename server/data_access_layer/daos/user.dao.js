const databases = require("../databases");
const UserModel = databases['mysqldb'].users;


exports.getUserByEmail = async (userModel = UserModel, email) => {
    return new Promise((resolve, reject) => {
        userModel.findOne({
            where: {
                user_email: email
            }
        })
        .then(async data => {
            if(data) resolve(data);
            resolve(false);
        })
        .catch(err => {
            console.log(err);
            const response = {
                status: 500,
                data: {},
                message: err.message || "some error occured"
            }
            console.log(response);
            reject(response);
        });
    });
};

exports.getAllUsers = async (userModel = UserModel) => {
    return new Promise((resolve, reject) => {
        userModel.findAll()
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
    
}

exports.createUser = async (userModel = UserModel, user) => {
    return new Promise((resolve, reject) => {
        userModel.create(user)
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
            }).catch(err => {
                const response = {
                    status: 500,
                    data: {},
                    message: err.message || "some error occured" 
                }
                reject(response);
            })
    });
};