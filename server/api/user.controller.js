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