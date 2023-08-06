const Pool = require("pg").Pool;

const pool = new Pool({
    user : "blpwbioq",
    password : "C_HN38OY4xFHR9gGv29ChX6j5ouySzsp",
    host : "trumpet.db.elephantsql.com",
    port : 5432 ,
    database : "blpwbioq"
});

module.exports = pool;