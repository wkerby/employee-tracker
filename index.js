//requirer inquirer 
const inquirer = require("inquirer");

//create instance of "Query" object
//TO DO: create a query class with methods to query data

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