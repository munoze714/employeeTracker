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
            default: console.table("employeeTracker_db")
        }
    });
}
startUp();
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
    console.table()
    // startUp();
};

function addRole() {
    let deptNames = [];
    connection.query("SELECT name FROM department", function (err, result) {
        Object.keys(result).forEach(function (key) {
            var row = result[key];
            deptNames.push(row.name);
            if (err) throw err;
        });
    });
    inquirer.prompt([
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
            choices: deptNames
        }
    ])
        .then(answers => {
            let dept;
            connection.query("SELECT id  FROM department WHERE name =  ? ", [answers.dept], (err, data) => {
                if (err) throw err;
                data.forEach(function (key) {
                    dept = key.id;
                });
                connection.query('INSERT INTO role (title , salary, departmentId ) VALUES (?,?,?)', [answers.title, answers.salary, dept]);
            });
        });
};

// function addEmployee() { };

// function viewDepartment() { };

// function viewRoles() { };

// function viewEmployee() { };

// function updateEmployeeRoles() { };