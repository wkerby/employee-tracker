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
                pass;
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

//add function to ask department add questions
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

    })

}