const ctable = require('console.table');
const inquirer = require('inquirer');
const connection = require("../connection");
const db = connection.db;

class Query {
    constructor() {
        this.db = db;
    }

    viewDepartments() { //returns all records in department table
        db.query('SELECT * FROM department', (err, answers) => {
            console.log('\n')
            console.table(answers);
        })
    }

    viewRoles() { //returns all records in role table
        db.query('SELECT role.id AS id, role.title AS title, role.salary AS salary, department.name As department FROM role JOIN department ON department.id = role.department_id', (err, answers) => {
            console.log('\n')
            console.table(answers);
        })
    }

    viewEmployees() { //returns all records in employee table
        db.query("SELECT table1.id, table1.first_name AS employee_first, table1.last_name AS employee_last, role.title, department.name as department, role.salary, CONCAT(table2.first_name,' ',table2.last_name) AS manager FROM employee table1 LEFT JOIN employee table2 ON table1.manager_id = table2.id JOIN role ON table1.role_id = role.id JOIN department ON role.department_id = department.id", (err, answers) => {
            console.log('\n')
            console.table(answers);
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

    addEmployee() {
        //obtain list of all employees
        db.query("SELECT CONCAT(first_name,' ', last_name) AS name from employee", (err, results) => {
            var employeeList = [];
            results.forEach(object => employeeList.push(object.name));
            db.query("SELECT title FROM role", (err, results) => {
                var roleList = [];
                results.forEach(object => roleList.push(object.title));
                let employeeAddQuestions = [
                    {
                        type: 'input',
                        message: "What is the employee's first name?",
                        name: 'employeefirst',
                    },
                    {
                        type: 'input',
                        message: "What is the employee's last name?",
                        name: 'employeelast',
                    },
                    {
                        type: 'list',
                        message: "What is the employee's role?",
                        name: 'employeerole',
                        choices: roleList, //list of employee roles
                    },
                    {
                        type: 'list',
                        message: "Who is the employee's manager?",
                        name: 'employeemanager',
                        choices: employeeList, //list of employee first and last names concatenated
                    }
                ]
                inquirer.prompt(employeeAddQuestions).then(answers => {
                    //grab the id of the role assigned to the employee
                    db.query(`SELECT id FROM role WHERE title = '${answers.employeerole}'`, (err, results) => {
                        let roleId = results[0].id; //this assumes that there are no duplicate ids
                        //get the id of the employee's manager
                        let managerFirstName = answers.employeemanager.split(' ')[0];
                        let managerLastName = answers.employeemanager.split(' ')[1];
                        db.query(`SELECT id FROM employee WHERE first_name = '${managerFirstName}' && last_name = '${managerLastName}'`, (err, results) => {
                            let managerId = results[0].id;
                            db.query("SELECT id FROM employee ORDER BY id DESC LIMIT 1", (err, results) => {
                                let nextId = results[0].id + 1;
                                db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (${nextId}, '${answers.employeefirst}', '${answers.employeelast}', ${roleId}, ${managerId})`)
                            })
                        })
                    })

                })

            })

        })

    }

    updateEmployee() {
        db.query("SELECT CONCAT(first_name,' ', last_name) AS name from employee", (err, results) => {
            let employeeList = [];
            results.forEach(object => employeeList.push(object.name));
            db.query("SELECT title FROM role", (err, results) => {
                let roleList = [];
                results.forEach(object => roleList.push(object.title));
                let employeeUpdateQuestions = [
                    {
                        type: 'list',
                        message: "Which employee's role would you like to update?", //list of employee first and last names concatenated
                        name: 'employeename',
                        choices: employeeList,
                    },
                    {
                        type: 'list',
                        message: "Which role would you like to assign to the selected employee?", //list of available employee roles
                        name: 'employeerole',
                        choices: roleList,

                    }
                ]

                inquirer.prompt(employeeUpdateQuestions).then(answers => {
                    //grab the id of the employee based off of his/her name
                    let employeeFirst = answers.employeename.split(' ')[0]; //split employee name into first and last name in agreeance with fields in employee table
                    let employeeLast = answers.employeename.split(' ')[1];
                    db.query(`SELECT id FROM employee WHERE first_name = '${employeeFirst}' && last_name = '${employeeLast}'`, (err, results) => {
                        let employeeId = results[0].id; //assumes there are no employees with same exact first and last name
                        //grab the id of the employee's new role
                        db.query(`SELECT id FROM role WHERE title = '${answers.employeerole}'`, (err, results) => {
                            let roleId = results[0].id; //assumes there are no duplicate roles
                            //update appropriate employee record with new title
                            db.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`);
                        })
                    })


                })

            })


        })


    }

}

// const query = new Query();
// query.viewDepartments();
// query.viewRoles();
// query.viewEmployees();
// query.addDepartment();
// query.addRole();
// query.addEmployee();
// query.updateEmployee();
// query.addRole('Boss of Everything', 900000, 'Safety');
// query.viewRoles();
// query.addEmployee('Colin', 'Harman', 'VDC Manager', 'Douglas MacArthur');
// query.updateEmployee('Colin Harman', 'Safety Manager');




module.exports = {
    Query
}