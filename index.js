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
        if (answers.next != "Quit") {
            let employeeData = new Query();
            switch (answers.next) {
                case "View all departments":
                    getDepartments(employeeData);
                case "View all roles":
                    getRoles(employeeData);
                case "View all employees":
                    getEmployees(employeeData);
                case "Add a department":
                    departmentAdd(employeeData);
                case "Add a role":
                    roleAdd(employeeData);
                case "Add an employee":
                    employeeData.addEmployee();
                case "Update an employee role":
                    pass;
            }

            doNext();

        }

        else {
            pass;
        }

    })
}

//add function to return all departments to user
const getDepartments = (query) => {
    try {
        query.viewDepartments();
    }
    catch (err) {
        console.log("There was an issue retrieving department data. Please try again.");
        doNext();
    }
}

//add function to return all roles to user
const getRoles = (query) => {
    try {
        query.viewRoles();
    }
    catch (err) {
        console.log("There was an issue retrieving role data. Please try again.")
        doNext();
    }
}

//add function to return all employees to user
const getEmployees = (query) => {
    try {
        query.viewEmployees();
    }
    catch (err) {
        console.log("There was an issue retrieving employee data. Please try again.")
        doNext();
    }
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

        try {
            query.addDepartment(answers.departmentname);
        }

        catch (err) {
            console.log("Please enter a valid department name.");
            departmentAdd();
        }


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
        try {
            query.addRole(answers.rolename, answers.rolesalary, answers.roledepartment);
        }
        catch (err) {
            console.log("Department name is not valid. Please try again.")
            roleAdd();
        }

    })
}


//add function to update existing employee record
const employeeUpdate = () => {
    let employeeUpdateQuestions = [
        {
            type: 'input',
            message: "Which employee's role would you like to update?", //list of employee first and last names concatenated
            name: 'employeefirst',
        },
        {
            type: 'input',
            message: "Which role would you like to assign to the selected employee?", //list of available employee roles
            name: 'employeelast',
        }
    ]
}