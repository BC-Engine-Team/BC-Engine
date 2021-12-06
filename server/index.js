const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;


const jwt = require('jsonwebtoken')

const app = express();


app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials : true,
  })
);


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true}));


app.use(
  session({
    key: "you",
    secret: "sus",
    resave = false,
    saveUninitialized: false,
    cookie:{
      expire: 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "BCEngineDB",
});




app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err);
        }

        db.query(
            "INSERT INTO users (email, passsword) VALUES (?,?)",
            [email, hash],
            (err, result) => {
                console.log(err);
            }
        );
    });
});

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if(!token){
        res.send("You need a valid token, please login again!");
    }
    else{
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if(err){
                res.json({auth: false, message: "U failed to authenticate"});
            }
            else{
                req.userId = decoded.id;
                next();
            }
        });
    }
}

app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.send("You are authenticated, congrats!!");
});


app.get("/login", (req, res) => {
    if (req.session.email){
        res.send({loggedIn: true, email: req.session.user});
    }
    else{
        res.send({loggedIn: false});
    }
});



app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE email = ?;",
        email,
        (err, result) => {
            if(err){
                res.send({err: err});
            }

            if(result.length > 0){
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if(response){
                        req.session.email = result;
                        
                        const id = result[0].id;

                        const token = jwt.sign({id}, "jwtSecret", {
                            expiresIn: 300,
                        })
                        req.session.email = result;
                        
                        res.json({auth: true, token: token, result: result});
                    }
                    else{
                        res.send({message: "Wrong username/password combination!"});
                    }
                });
            }
            else{
                res.send({message: "User doesn't exist"})
            }
            
        }
    );
});

app.listen(3001, () => {
    console.log("running server");
});