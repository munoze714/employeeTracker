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
// function addDepartment() {
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
// };