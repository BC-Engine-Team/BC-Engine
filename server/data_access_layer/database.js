const {createPool} = require('mysql');

const pool = createPool({
    host: "localhost",
    user: "bcengineusertest",
    password: "Boubou12345"
});


pool.query(`select * from bcenginedb.users`, (err, res)=>{
    if(err){
        return console.log(err);
    }
    return console.log(res);
});

