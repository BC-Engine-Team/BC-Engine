const userService = require('../services/user.service');
const authService = require('../services/auth.service');

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request    
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

    // Call service to save User to db
    userService.createUser(user)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

// Fetch all Users from db
exports.findAll = (req, res) => {
    userService.getAllUsers()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

// fetch all users with admin role
exports.getAdmins = (req, res) => {
    userService.getAdmins()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

// Begining of Authenticate a user
exports.authenticateUserWithEmail = (req, res) => {
    const login = req.body;
    let authUser = {};

    if(!login.email){
        res.status(400).send({
            message: "Content cannot be empty."
        });
        return;
    }

    userService.authenticateUser(login)
        .then(response => {
            authUser = response;
            if(!authUser) {
                res.send({
                    auth: false,
                    message: "No user found"
                });
                return;
            }

            var [accessToken, refreshToken] = authService.getTokens(authUser);
            res.send({
                authenticatedUser: authUser,
                aToken: accessToken,
                rToken: refreshToken,
                auth: true
            })
            return;
        })
        .catch(err => {
            res.status(500).send(err);
        });
};


