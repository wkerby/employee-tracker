const connection = require("../connection");
const db = connection.db;

class Query {
    constructor() {
        this.db = db;
    }

    viewDepartments() { //returns all records in department table
        db.query('SELECT * FROM department', (err, results) => {
            console.log(results)
        })
    }

    viewRoles() { //returns all records in role table
        db.query('SELECT * FROM role', (err, results) => {
            console.log(results)
        })
    }

    viewEmployees() { //returns all records in employee table
        db.query('SELECT * FROM employee', (err, results) => {
            console.log(results)
        })
    }

    addDepartment(department_name) { //takes user input for department name and creates new department record in department table
        db.query("SELECT * FROM department ORDER BY id DESC LIMIT 1", (err, results) => {
            let nextId = results[0].id + 1; //determine next id int to use by grabbing the last id in the table
            db.query(`INSERT INTO department (id, name) VALUES (${nextId}, '${department_name}')`);
        })
    }

    addRole(role_title, role_salary, role_department) {
        //grab the id of the department to which the new role belongs
        db.query(`SELECT id from department WHERE name = '${role_department}'`, (err, results) => {
            let departmentId = results[0].id;
            db.query("SELECT * FROM role ORDER BY id DESC LIMIT 1", (err, results) => { //determine next id int to use by grabbing the last id in the table
                let nextId = results[0].id + 1;
                db.query(`INSERT INTO role (id, title, salary, department_id) VALUES (${nextId}, '${role_title}', ${role_salary}, ${departmentId})`);
            })
        })
    }

}

const query = new Query();
// query.viewDepartments();
query.addRole('Boss of Everything', 900000, 'Safety');
query.viewRoles();

module.exports = {
    Query
}