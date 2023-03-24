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
        db.query("SELECT id FROM department ORDER BY id DESC LIMIT 1", (err, results) => {
            let nextId = results[0].id + 1; //determine next id int to use by grabbing the last id in the table
            db.query(`INSERT INTO department (id, name) VALUES (${nextId}, '${department_name}')`);
        })
    }

    addRole(role_title, role_salary, role_department) {
        //grab the id of the department to which the new role belongs
        db.query(`SELECT id FROM department WHERE name = '${role_department}'`, (err, results) => {
            let departmentId = results[0].id;
            db.query("SELECT id FROM role ORDER BY id DESC LIMIT 1", (err, results) => { //determine next id int to use by grabbing the last id in the table
                let nextId = results[0].id + 1;
                db.query(`INSERT INTO role (id, title, salary, department_id) VALUES (${nextId}, '${role_title}', ${role_salary}, ${departmentId})`);
            })
        })
    }

    addEmployee(employee_first_name, employee_last_name, employee_role, employee_manager) {
        //grab the id of the role assigned to the employee
        db.query(`SELECT id FROM role WHERE title = '${employee_role}'`, (err, results) => {
            let roleId = results[0].id; //this assumes that there are no duplicate ids
            //get the id of the employee's manager
            let managerFirstName = employee_manager.split(' ')[0];
            let managerLastName = employee_manager.split(' ')[1];
            db.query(`SELECT id FROM employee WHERE first_name = '${managerFirstName}' && last_name = '${managerLastName}'`, (err, results) => {
                let managerId = results[0].id;
                db.query("SELECT id FROM employee ORDER BY id DESC LIMIT 1", (err, results) => {
                    let nextId = results[0].id + 1;
                    db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (${nextId}, '${employee_first_name}', '${employee_last_name}', ${roleId}, ${managerId})`)
                })
            })
        })


    }



}

const query = new Query();
// query.viewDepartments();
// query.addRole('Boss of Everything', 900000, 'Safety');
// query.viewRoles();
// query.addEmployee('Colin', 'Harman', 'VDC Manager', 'Douglas MacArthur');
query.viewEmployees();

module.exports = {
    Query
}