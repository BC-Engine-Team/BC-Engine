const userService = require('../services/user.service');
const authService = require('../services/auth.service');

// Create and Save a new User
exports.create = async (req, res) => {
    if(req.user.role !== "admin") return res.status(403).send();
    // Validate request    
    if(!req.body.email || !req.body.password 
        || !req.body.role){
        return res.status(400).send({
            message: "Content cannot be empty."
        });
    }
    if(!req.body.email.endsWith("@benoit-cote.com")){
        return res.status(400).send({
            message: "Invalid email format."
        })
    }

    // Create a User
    const user = {
        email: req.body.email,
        password: req.body.password,
        name: req.emp.name,
        role: req.body.role
    };

    // Call service to save User to db
    await userService.createUser(user)
        .then(response => {
            return res.send(response);
        })
        .catch(err => {
            if(err.message === "Validation error"){
                err.message = "User already exists.";
                return res.status(400).send(err);
            }
            else{
                return res.status(500).send(err);
            }
            
        });
};

// Fetch all Users from db
exports.findAll = async (req, res) => {
    if(req.user.role !== "admin") return res.status(403).send();
    await userService.getAllUsers()
        .then(response => {
            return res.status(200).send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
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
            if(response == null || !response) {
                return res.status(401).send({
                    auth: false,
                    message: "No user found"
                });
            }

            authUser = response.dataValues;
            var [accessToken, refreshToken] = authService.getTokens(authUser);

            const returnUser = {
                email: authUser.email,
                name: authUser.name,
                role: authUser.role
            };
            return res
            .header('authorization', refreshToken)
            .send({
                authenticatedUser: returnUser,
                aToken: accessToken,
                auth: true
            });
        })
        .catch(err => {
            return res.status(500).send(err.message);
        });
};


exports.modifyUser = async(req, res) => {
    if(req.user.role !== "admin") return res.status(403).send();

    // Validate request    
    if(!req.body.email || req.body.email === ""){
        return res.status(400).send({
            message: "Content cannot be empty."
        });
    }

    const user = {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };

    await userService.modifyUser(user)
        .then(response => {
            return res.send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
} 

exports.deleteUser = async(req, res) => {
    if(req.user.role !== "admin") return res.status(403).send();


    await userService.deleteUser(req.body.email)
        .then(response => {
            return res.send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
}

