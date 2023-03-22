const connection = require("../connection");
const db = connection.db;

class Query {
    constructor() {
        this.db = db;
    }

    viewDepartments() {
        db.query('SELECT * FROM department', (err, results) => {
            console.log(results)
        })
    }

    viewRoles() {
        db.query('SELECT * FROM role', (err, results) => {
            console.log(results)
        })
    }

    viewEmployees() {
        db.query('SELECT * FROM employee', (err, results) => {
            console.log(results)
        })
    }

}

const myQuery = new Query();

myQuery.viewDepartments();