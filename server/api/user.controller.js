const mysqldb = require("../data_access_layer/mysqldb");
const User = mysqldb.users;
const Op = mysqldb.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    console.log(req.body);
    
    if(!req.body.email){
        res.status(400).send({
            message: "Content cannot be empty."
        });
        return;
    }

    // Create a User
    const user = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        role: req.body.role
    };

    // Save User to db
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while trying to save to the db."
            });
        });
};

// Fetch all Users from db
exports.findAll = (req, res) => {
    User.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while fetching all users."
            });
        });
};

// fetch all users with admin role
exports.getAdmins = (req, res) => {
    User.findAll({
        where: {
            role: 'admin'
        }
    })
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        console.log(err);
    });
};

// Begining of Authenticate a user
exports.authenticateUserWithEmail = (req, res) => {
    const user = req.body;
    return new Promise((resolve, reject) => {
        try {
            User.findOne({
            where: {
                user_email: user.email 
            }
        })
        .then(async (response) => {
            if (!response) {
                res.status(500).send({
                    message: "Some error occured while authenticating."
                });
                resolve(false);

            } else {
                if (!response.dataValues.password || 
                    !await response.validPassword(user.password, 
                    response.dataValues.password)) {
                        res.status(401).send({
                            message: "Failed to authenticate."
                        });
                        resolve(false);
                } else {
                    res.send(response.dataValues)
                    resolve(response.dataValues)
                }
            }
        })
        } catch (error) {
            const response = {
                status: 500,
                data: {},
                error: {
                    message: error.message || "user match failed"
                }
            };
            res.status(500).send(response);
            reject(response);
        }
    });

    
};

