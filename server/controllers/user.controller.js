const userService = require('../services/user.service');
const authService = require('../services/auth.service');

// Create and Save a new User
exports.create = async (req, res) => {
    if(!req.user.role === "admin") return res.status(403).send();
    
    // Validate request    
    if(!req.body.email){
        return res.status(400).send({
            message: "Content cannot be empty."
        });
    }

    // Create a User
    const user = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        role: req.body.role
    };

    // Call service to save User to db
    await userService.createUser(user)
        .then(response => {
            return res.send(response);
        })
        .catch(err => {
            return res.send(err);
        });
};

// Fetch all Users from db
exports.findAll = async (req, res) => {
    if(!req.user.role === "admin") res.status(403).send();
    await userService.getAllUsers()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

// fetch all users with admin role
exports.getAdmins = async (req, res) => {
    if(!req.user.role === "admin") res.status(403).send();
    await userService.getAdmins()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

// Begining of Authenticate a user
exports.authenticateUserWithEmail = async (req, res) => {
    const user = req.body;
    let authUser = {};

    if(!user.email){
        res.status(400).send({
            message: "Content cannot be empty."
        });
        return;
    }

    await userService.authenticateUser(user)
        .then(response => {
            authUser = response;
            if(authUser == null || !authUser) {
                return res.status(401).send({
                    auth: false,
                    message: "No user found"
                });
            }

            var [accessToken, refreshToken] = authService.getTokens(authUser);
            return res
            .header('authorization', refreshToken)
            .send({
                authenticatedUser: authUser,
                aToken: accessToken,
                auth: true
            })
        })
        .catch(err => {
            return res.status(500).send(err.message);
        });
};


