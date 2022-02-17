const UserDAO = require('../data_access_layer/daos/user.dao');

exports.createUser = async (user) => {
    return new Promise((resolve, reject) => {
        UserDAO.createUser(user)
            .then(async data => {
                if (data) resolve(data);
                resolve(false);
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
                if (data) {

                    // Puts users in alphabetical order for the users table
                    let sortedUser = data.sort((a, b) => {
                        let userA = a.name.toUpperCase();
                        let userB = b.name.toUpperCase();
                        return (userA < userB) ? -1 : (userA > userB) ? 1 : 0;
                    });
                    resolve(sortedUser);
                }
                resolve(false);
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
                if (!data) resolve(false);
                if (!data.password ||
                    !await data.validPassword(user.password, data.password)) {
                    resolve(false);
                } else {
                    resolve(data);
                }
            }).catch(err => {
                const response = {
                    status: 500,
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
                if (data) resolve(data);
                resolve(false);
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
                if (data) resolve(data);
                resolve(false)
            })
            .catch(err => {
                reject(err);
            });
    });
}
