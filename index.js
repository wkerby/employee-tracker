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
                employeeData.addEmployee();
                break;
            case "Update an employee role":
                employeeData.updateEmployee();
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
        try {
            query.addRole(answers.rolename, answers.rolesalary, answers.roledepartment);
        }

        catch (err) {
            console.log("Department name is not valid. Please try again.")
            roleAdd();
        }


    })

}

function quitProgram() {
    console.log("end");
    process.exit();

}

doNext();
