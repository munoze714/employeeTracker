// Dependecies
var inquirer = require("inquirer");
var mysql = require("mysql");

// ==============================================================================
// MYSQL CONFIGURATION
// This sets up the basic properties for our mysql connection
// ==============================================================================

// Create a connection to the DB
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "rootroot",
    database: "employeeTracker_db"
});

// Inquirer
function startUp() {
    inquirer.prompt([{
        type: "list",
        name: "task",
        message: "What would you like to do?",
        choices: ["Add a department", "Add a role",
            "Add an Employee", "View Department", "View Roles", "View Employees", "Update Employee Roles"]
    }
    ]).then(answers => {
        switch (answers.task) {
            case "Add a department": addDepartment();
                break;
            case "Add a role": addRole();
                break;
            case "Add an Employee": addEmployee();
                break;
            case "View Department": viewDepartment();
                break;
            case "View Roles": viewRoles();
                break;
            case "View Employees": viewEmployee();
                break;
            case "Update Employee Roles": updateEmployeeRoles();
                break;
        }
    });
}

function addDepartment() {
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: "input",
                name: "department",
                message: "Whats your Department?"
            }
        ])
        .then(answers => {
            console.log(answers);
            connection.query('INSERT INTO department (name) VALUES (?)', [answers.department]);
        });
};

function addRole() {
    connection.query('SELECT * FROM department', function (err, result) {
        //new array for dept names
        let deptNames = [];
        //for loop thru depts
        result.forEach(element => {
            deptNames.push(element);
        });
        inquirer
            .prompt([
                /* Pass your questions in here */
                {
                    type: "input",
                    name: "title",
                    message: "Whats your Role title?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Input your Salary"
                },
                {
                    type: "list",
                    name: "dept",
                    message: "Choose your dept",
                    choices: [deptNames]
                }
            ])
            .then(answers => {
                connection.query("SELECT department(id) FROM department WHERE name = ?"[answers.dept], (err, data) => {
                    const dept = data[0]['department(id)'];
                    connection.query("INSERT INTO role (departmentId) VALUES (?)", [dept]);
                })
                connection.query('INSERT INTO role (title , salary) VALUES (?)', [answers.title, answers.salary]);
                console.log(answers);
            });
    });
};

function addEmployee() { };

function viewDepartment() { };

function viewRoles() { };

function viewEmployee() { };

function updateEmployeeRoles() { };