const databases = require("../databases");
const UserModel = databases['mysqldb'].users;

exports.getUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        console.log(UserModel);
        UserModel.findOne({
            where: {
                user_email: email
            }
        })
        .then(async data => {
            console.log(data);
            if(data) resolve(data);
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

exports.createUser = async (user) => {
    return new Promise((resolve, reject) => {
        UserModel.create(user)
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