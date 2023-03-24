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
        db.query('SELECT role.id AS id, role.title AS title, role.salary AS salary, department.name As department FROM role JOIN department ON department.id = role.department_id', (err, results) => {
            console.log(results)
        })
    }

    viewEmployees() { //returns all records in employee table
        db.query('SELECT table1.id, table1.first_name AS employee_first, table1.last_name AS employee_last, role.title, department.name as department, role.salary, table2.first_name AS manager_first, table2.last_name AS manager_last FROM employee table1 JOIN employee table2 ON table1.manager_id = table2.id JOIN role ON table1.role_id = role.id JOIN department ON role.department_id = department.id', (err, results) => {
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

    updateEmployee(employee_name, employee_role) {
        //grab the id of the employee based off of his/her name
        let employeeFirst = employee_name.split(' ')[0]; //split employee name into first and last name in agreeance with fields in employee table
        let employeeLast = employee_name.split(' ')[1];
        db.query(`SELECT id FROM employee WHERE first_name = '${employeeFirst}' && last_name = '${employeeLast}'`, (err, results) => {
            let employeeId = results[0].id; //assumes there are no employees with same exact first and last name
            //grab the id of the employee's new role
            db.query(`SELECT id FROM role WHERE title = '${employee_role}'`, (err, results) => {
                let roleId = results[0].id; //assumes there are no duplicate roles
                //update appropriate employee record with new title
                db.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`);
            })
        })
    }

}

const query = new Query();
// query.viewDepartments();
// query.addRole('Boss of Everything', 900000, 'Safety');
// query.viewRoles();
// query.addEmployee('Colin', 'Harman', 'VDC Manager', 'Douglas MacArthur');
// query.updateEmployee('Colin Harman', 'Safety Manager');
query.viewEmployees();
// query.joinManagers();


module.exports = {
    Query
}