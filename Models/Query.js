const ctable = require('console.table');
const inquirer = require('inquirer');
const connection = require("../connection");
const db = connection.db;

class Query {
    constructor() {
        this.db = db;
    }

    viewDepartments() { //returns all records in department table
        return db.promise().query('SELECT * FROM department');

    }

    viewRoles() { //returns all records in role table
        return db.promise().query('SELECT role.id AS id, role.title AS title, role.salary AS salary, department.name As department FROM role JOIN department ON department.id = role.department_id');

    }

    viewEmployees() { //returns all records in employee table
        return db.promise().query("SELECT table1.id, table1.first_name AS employee_first, table1.last_name AS employee_last, role.title, department.name as department, role.salary, CONCAT(table2.first_name,' ',table2.last_name) AS manager FROM employee table1 LEFT JOIN employee table2 ON table1.manager_id = table2.id JOIN role ON table1.role_id = role.id JOIN department ON role.department_id = department.id");
    }

    addDepartment(department_name) { //takes user input for department name and creates new department record in department table
        db.query("SELECT id FROM department ORDER BY id DESC LIMIT 1", (err, results) => {
            let nextId = results[0].id + 1; //determine next id int to use by grabbing the last id in the table
            return db.query(`INSERT INTO department (id, name) VALUES (${nextId}, '${department_name}')`);
        })
    }

    addRole(role_title, role_salary, role_department) {
        //grab the id of the department to which the new role belongs
        db.query(`SELECT id FROM department WHERE name = '${role_department}'`, (err, results) => {
            let departmentId = results[0].id;
            db.query("SELECT id FROM role ORDER BY id DESC LIMIT 1", (err, results) => { //determine next id int to use by grabbing the last id in the table
                let nextId = results[0].id + 1;
                return db.query(`INSERT INTO role (id, title, salary, department_id) VALUES (${nextId}, '${role_title}', ${role_salary}, ${departmentId})`);
            })
        })
    }

    // listEmployees() {
    //     //obtain list of all employees
    //     db.query("SELECT CONCAT(first_name,' ', last_name) AS name from employee", (err, results) => {
    //         var employeeList = [];
    //         results.forEach(object => employeeList.push(object.name));
    //         console.log(employeeList);
    //         return employeeList;
    //     });
    // }


    listEmployees(callback) {
        db.query("SELECT CONCAT(first_name,' ', last_name) AS name FROM employee", function (err, results) {
            if (err) {
                callback(err, null);//return an error if error with query string
            } else {
                var employeeList = [];
                results.forEach(function (object) {
                    employeeList.push(object.name);
                });
                callback(null, employeeList);
            }
        });
    }


    listRoles(callback) {
        db.query("SELECT title FROM role", function (err, results) {
            if (err) {
                console.log(err);
                callback(err, null); //return an error if error with query string
            } else {
                var roleList = [];
                results.forEach(function (object) {
                    roleList.push(object.title);
                });
                callback(null, roleList);
            }
        });
    }


}


module.exports = {
    Query
}