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

    addDepartment(department_name) {
        db.query("SELECT * FROM department ORDER BY id DESC LIMIT 1", (err, results) => {
            let nextId = results[0].id + 1;
            db.query(`INSERT INTO department (id, name) VALUES (${nextId}, '${department_name}')`)
        })
    }

}

const query = new Query();


module.exports = {
    Query
}