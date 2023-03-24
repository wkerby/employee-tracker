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
        switch (answers.next) {
            case "View all departments":
                pass;
            case "View all roles":
                pass;
            case "View all employees":
                pass;
            case "Add a department":
                departmentAdd();
            case "Add a role":
                pass;
            case "Add an employee":
                pass;
            case "Update an employee role":
                pass;
            case "Quit":
                pass;
        }
    })
}

//add function to ask department add questions and to add department to employee_db
const departmentAdd = () => {
    let departmentAddQuestion = [
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'departmentname',
        }

    ]

    inquirer.prompt(departmentAddQuestion).then(answers => {
        let employeeData = new Query();
        employeeData.addDepartment(answers.departmentname);
        try {
            employeeData.addDepartment(answers.departmentname);
        }

        catch (err) {
            console.log("Please enter a valid department name.");
            departmentAdd();
        }


    })

}

//add function to ask role add questions and to add role to employee_db
const roleAdd = () => {
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
    inquire.prompt(roleAddQuestions).then(answers => {
        let employeeData = new Query();
        try {
            employeeData.addRole(answers.rolename, answers.rolesalary, answers.roledepartment);
        }
        catch (err) {
            console.log("Department name is not valid. Please try again.")
            roleAdd();
        }

    })
}