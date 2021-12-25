const databases = require("../data_access_layer/databases");
const User = databases['mysqldb'].users;
const UserDAO = require('../data_access_layer/daos/user.dao');
const Op = databases.Sequelize.Op;

exports.createUser = async (user) => {
    return new Promise((resolve, reject) => {
        UserDAO.createUser(user)
            .then(async data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

exports.getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        UserDAO.getAllUsers()
            .then(async data => {
                if(data) resolve(data);
                resolve("Could not get all users.");
            })
            .catch(err => {
                reject(err);
            });
    });
};

exports.authenticateUser = async (user) => {
    return new Promise((resolve, reject) => {
        UserDAO.getUserByEmail(user.email)
        .then(async data => {
            if(!data) resolve(false);
            if(!data.password ||
                !await data.validPassword(user.password, data.password)){
                    resolve(false);
            } else {
                resolve(data);
            }
        }).catch(err => {
            const response = {
                status: 500,
                data: {},
                message: err.message || "some error occured"
            }
            reject(response);
        });
    });
};

exports.modifyUser = async (user) => {
    return new Promise((resolve, reject) => {
        UserDAO.updateUser(user)
            .then(async data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

exports.deleteUser = async (email) => {
    return new Promise((resolve, reject) => {
        UserDAO.deleteUser(email)
            .then(async data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
}
