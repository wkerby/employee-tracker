//create connection to mysql db
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'Whatthebug96!',
        database: 'employee_db' //this will be the na
    },
    console.log(`Connected to the employee_db database.`)
);

module.exports = {
    db
};
