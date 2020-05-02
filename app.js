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
            // default: console.table("")
        }
    });
}
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
            startUp()
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
                startUp()
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
        connection.query("SELECT * FROM employeeTracker_db.employee WHERE managerId IS NULL", function (err, empResult) {
            // console.log('resuslt from where is null query', empResult)
            let managerNames = [
                "I am a Manager"
            ];
            empResult.forEach(key => {
                // console.log("were looping", key)
                //if (key.title === "manager") {
                managerNames.push(key.firstName);
                //}
            });
            // console.log('this is our manger names array for hcoices', managerNames)
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
                    // console.log(answers);
                    var roleId = result.filter(key => {
                        return key.title === answers.roleId
                    })

                    var managerId;
                    empResult.forEach(key => {
                        if (key.firstName === answers.managerId) {
                            managerId = key.id
                        } else if (answers.managerId === "I am a Manager") {
                            managerId = null
                        };
                    });
                    connection.query('INSERT INTO employee (firstName , lastName, roleId, ManagerId) VALUES (?,?,?,?)',
                        [answers.first_Name, answers.last_Name, roleId[0].id, managerId]);
                    startUp()
                });
        });
    });

};


function viewDepartment() {
    connection.query("SELECT * FROM department", (err, data) => {
        console.clear();
        console.table("Department Table", data);
    })
    startUp();
};

function viewRoles() {
    connection.query("SELECT * FROM role LEFT JOIN department ON department.id = role.departmentId;", (err, data) => {
        console.clear();
        console.table("Roles table", data);
    })
    startUp();
};

function viewEmployee() {
    connection.query("SELECT employee.id , employee.firstName ,employee.lastName, employee.roleId, role.title , employee.managerId FROM employee LEFT JOIN role ON role.id = employee.roleId;", (err, data) => {
        console.clear();
        console.table("Employee table", data);
    })
    startUp();
};

// function updateEmployeeRoles() { };

