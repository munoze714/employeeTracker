// Dependecies
var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table")

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
        };
    });
};
connection.connect(function (err) {
    if (err) throw err;
    console.clear();
    startUp();
});

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
            // console.log(answers);
            connection.query('INSERT INTO department (name) VALUES (?)', [answers.department]);
            console.clear();
            startUp();
        });
};

function addRole() {
    let deptNames = [];
    connection.query("SELECT * FROM department", function (err, result) {
        result.forEach(key => {
            deptNames.push(key.name);
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
        ]).then(answers => {
            let dept;
            connection.query("SELECT id  FROM department WHERE name =  ? ", [answers.dept], (err, data) => {
                if (err) throw err;
                data.forEach(function (key) {
                    dept = key.id;
                });
                connection.query('INSERT INTO role (title , salary, departmentId ) VALUES (?,?,?)', [answers.title, answers.salary, dept]);
                console.clear();
                startUp();
            });
        });
    });
};

function addEmployee() {
    let roleNames = [];
    connection.query("SELECT * FROM role", function (err, result) {
        result.forEach(key => {
            roleNames.push(key.title);
        });
        let managerNames = ["I am a Manager"];
        connection.query("SELECT * FROM employee WHERE managerId IS NULL", function (err, empResult) {
            empResult.forEach(key => {
                managerNames.push(key.firstName);
            });
            inquirer
                .prompt([
                    /* Pass your questions in here */
                    {
                        type: "input",
                        name: "first_Name",
                        message: "Enter Your First Name?"
                    },
                    {
                        type: "input",
                        name: "last_Name",
                        message: "Enter Your Last Name?"
                    },
                    {
                        type: "list",
                        name: "roleId",
                        message: "Choose your Role",
                        choices: roleNames
                    },
                    {
                        type: "list",
                        name: "managerId",
                        message: "Who is your Manager",
                        choices: managerNames
                    },
                ]).then(answers => {
                    var roleId = result.filter(key => {
                        return key.title === answers.roleId;
                    });
                    var managerId;
                    empResult.forEach(key => {
                        if (key.firstName === answers.managerId) {
                            managerId = key.id;
                        } else if (answers.managerId === "I am a Manager") {
                            managerId = null;
                        };
                    });
                    connection.query("INSERT INTO employee (firstName , lastName, roleId, ManagerId) VALUES (?,?,?,?)",
                        [answers.first_Name, answers.last_Name, roleId[0].id, managerId]);
                    console.clear();
                    startUp();
                });
        });
    });
};

function viewDepartment() {
    connection.query("SELECT * FROM department", (err, data) => {
        console.clear();
        console.table("Department Table", data, "(Move up/down to reselect)");
    });
    console.clear();
    startUp();
};

function viewRoles() {
    connection.query("SELECT * FROM role LEFT JOIN department ON department.id = role.departmentId;", (err, data) => {
        console.clear();
        console.table("Roles table", data, "(Move up/down to reselect)");
    })
    console.clear();
    startUp();
};

function viewEmployee() {
    connection.query("SELECT employee.id , employee.firstName ,employee.lastName, employee.roleId, role.title , employee.managerId FROM employee LEFT JOIN role ON role.id = employee.roleId;", (err, data) => {
        console.clear();
        console.table("Employee table", data, "(Move up/down to reselect)");
    })
    console.clear();
    startUp();
};

function updateEmployeeRoles() {
    let employeeNames = [];
    connection.query("SELECT * FROM employee", function (err, updateResult) {
        updateResult.forEach(key => {
            employeeNames.push(key.firstName);
        });

        inquirer.prompt([
            {
                type: "list",
                name: "empName",
                message: "Which Employee?",
                choices: employeeNames
            }
        ]).then(answers => {
            let roleIdUpdate;
            connection.query("SELECT roleId  FROM employee WHERE firstName =  ? ", [answers.empName], (err, data) => {
                data.forEach(key => {
                    roleIdUpdate = key.roleId;
                });
                let roleTitle = [];
                connection.query("SELECT * FROM role", function (err, roleresult) {
                    roleresult.forEach(key => {
                        roleTitle.push(key.title);
                    });
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "updateRole",
                            message: "Choose Department",
                            choices: roleTitle
                        }
                    ]).then(answersRole => {
                        connection.query("UPDATE role SET title = ? WHERE id = ?", [answersRole.updateRole, roleIdUpdate]);
                        console.clear();
                        startUp()
                    });
                });
            });
        });
    });
};





