//requirer inquirer 
const inquirer = require("inquirer");

//bring in Query class
const Query = require("./Models/Query").Query;

//create function to ask question

const doNext = () => {
    // begin list of questions
    let doNextQuestion = [
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'next',
            choices: ["View all departments", "View all roles",
                "View all employees", "Add a department", "Add a role",
                "Add an employee", "Update an employee role", "Quit"]
        }

    ]
    inquirer.prompt(doNextQuestion).then(answers => {

        let employeeData = new Query();
        switch (answers.next) {
            case "View all departments":
                getDepartments(employeeData);
                break;
            case "View all roles":
                getRoles(employeeData);
                break;
            case "View all employees":
                getEmployees(employeeData);
                break;
            case "Add a department":
                departmentAdd(employeeData);
                break;
            case "Add a role":
                roleAdd(employeeData);
                break;
            case "Add an employee":
                employeeAdd(employeeData);
                break;
            case "Update an employee role":
                employeeUpdate(employeeData);
                break;
            default:
                quitProgram();

        }

    })
}

//add function to return all departments to user
const getDepartments = (query) => {


    query.viewDepartments().then(([answers]) => {
        console.log('\n')
        console.table(answers);
        doNext();
    }).catch(err => console.log(err))

};

//add function to return all roles to user
const getRoles = (query) => {

    query.viewRoles().then(([answers]) => {
        console.log('\n')
        console.table(answers);
        doNext();
    }).catch(err => console.log(err))
}

//add function to return all employees to user
const getEmployees = (query) => {
    query.viewEmployees().then(([answers]) => {
        console.log('\n')
        console.table(answers);
        doNext();
    }).catch(err => console.log(err))

}

//add function to ask department add questions and to add department to employee_db
const departmentAdd = (query) => {
    let departmentAddQuestion = [
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'departmentname',
        }

    ]

    inquirer.prompt(departmentAddQuestion).then(answers => {


        query.addDepartment(answers.departmentname)
        console.log(`${answers.departmentname} added!`);
        doNext();


        // catch (err) {
        //     console.log("Please enter a valid department name.");
        //     departmentAdd();
        // }


    }).catch(err => {
        console.log("Please enter a valid department name");
        doNext();
    })

}

//add function to ask role add questions and to add role to employee_db
const roleAdd = (query) => {

    let roleAddQuestions = [
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'rolename',
        },
        {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'rolesalary',
        },
        {
            type: 'input',
            message: 'To which department does the role belong?',
            name: 'roledepartment',
        }
    ]
    inquirer.prompt(roleAddQuestions).then(answers => {

        query.addRole(answers.rolename, answers.rolesalary, answers.roledepartment);
        console.log(`${answers.rolename} added to ${answers.roledepartment} department!`);
        doNext();


    }).catch(err => {
        console.log("Department name provided is not valid. Please try again.")
        doNext();

    })

}

//add function to ask employee add questions and add employee to employee_db
const employeeAdd = (query) => {
    query.listEmployees(function (err, results) {
        if (err) {
            console.error(err);
        }
        else {
            var employees = results;
        }
        query.listRoles(function (err, results) {
            if (err) {
                console.error(err);
            }
            else {
                var roles = results;
            }
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
                    choices: roles, //list of employee roles
                },
                {
                    type: 'list',
                    message: "Who is the employee's manager?",
                    name: 'employeemanager',
                    choices: employees //list of employee first and last names concatenated
                }
            ]
            inquirer.prompt(employeeAddQuestions).then(answers => {
                //grab the id of the role assigned to the employee
                query.db.query(`SELECT id FROM role WHERE title = '${answers.employeerole}'`, (err, results) => {
                    let roleId = results[0].id; //this assumes that there are no duplicate ids
                    //get the id of the employee's manager
                    let managerFirstName = answers.employeemanager.split(' ')[0];
                    let managerLastName = answers.employeemanager.split(' ')[1];
                    query.db.query(`SELECT id FROM employee WHERE first_name = '${managerFirstName}' && last_name = '${managerLastName}'`, (err, results) => {
                        let managerId = results[0].id;
                        query.db.query("SELECT id FROM employee ORDER BY id DESC LIMIT 1", (err, results) => {
                            let nextId = results[0].id + 1;
                            query.db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (${nextId}, '${answers.employeefirst}', '${answers.employeelast}', ${roleId}, ${managerId})`);
                        })
                    })
                })
                console.log(`${answers.employeefirst} ${answers.employeelast} added to database!`)
                doNext();
            }).catch(err => {
                console.log("Employee's role or manager is invalid. Please try again");
                doNext();
            })
        });

    })


}

const employeeUpdate = (query) => {
    query.listEmployees(function (err, results) {
        if (err) {
            console.error(err);
        }
        else {
            var employees = results;
        }
        query.listRoles(function (err, results) {
            if (err) {
                console.error(err);
            }
            else {
                var roles = results;
            }
            let employeeUpdateQuestions = [
                {
                    type: 'list',
                    message: "Which employee's role would you like to update?", //list of employee first and last names concatenated
                    name: 'employeename',
                    choices: employees,
                },
                {
                    type: 'list',
                    message: "Which role would you like to assign to the selected employee?", //list of available employee roles
                    name: 'employeerole',
                    choices: roles,

                }
            ]

            inquirer.prompt(employeeUpdateQuestions).then(answers => {
                //grab the id of the employee based off of his/her name
                let employeeFirst = answers.employeename.split(' ')[0]; //split employee name into first and last name in agreeance with fields in employee table
                let employeeLast = answers.employeename.split(' ')[1];
                query.db.query(`SELECT id FROM employee WHERE first_name = '${employeeFirst}' && last_name = '${employeeLast}'`, (err, results) => {
                    let employeeId = results[0].id; //assumes there are no employees with same exact first and last name
                    //grab the id of the employee's new role
                    query.db.query(`SELECT id FROM role WHERE title = '${answers.employeerole}'`, (err, results) => {
                        let roleId = results[0].id; //assumes there are no duplicate roles
                        //update appropriate employee record with new title
                        query.db.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`);
                    })
                })
                console.log(`${employeeFirst} ${employeeLast} updated to ${answers.employeerole}!`)
                doNext();
            }).catch(err => {
                console.error(err);
                console.log("Unable to update employee role. Please try again.");
                doNext();
            })
        })
    })



}

function quitProgram() {
    console.log("Thanks for checking in!");
    process.exit();

}

doNext();

module.exports = doNext;