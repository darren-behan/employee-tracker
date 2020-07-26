const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeeTracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// What would you like to do?
// View all employees
  // List employees
// View all employees by department
  // Filter by department => OUTER JOIN
// View all employees by manager
  // Filter by manager => OUTER JOIN
// Add employee
  // First Name
  // Last Name
  // Role
  // Manager
// Remove employee
  // List employees
// Update employee role
  // List employees
  // List roles to update for employee
// Update employee manager
  // List employees
  // List managers to update for employee
// View all roles
// Exit

// console.log() if operation was successful => example: "${first_name} ${last_name} has been added"
// After user selects each option, run start() function again

function start() {
  inquirer
    .prompt({
      name: "databaseOptions",
      type: "list",
      message: "What would you like to do?",
      choices: ["View all employees", "View all employees by department", "View all employees by manager", "Add employee", "Remove employee", "Update employee role", "Update employee manager", "View all roles", "Exit"]
    })
    .then(function(answer) {
      // based on their answer, call the function relevant to the option selected
      if (answer.databaseOptions === "View all employees") {
        listEmployees();
      } else if (answer.databaseOptions === "Exit") {
        connection.end();
      } else {
        connection.end();
      }
    });
}

// Returns a formatted table showing all employees
function listEmployees() {
  connection.query(
    "SELECT * FROM employeeTracker_DB.employee",
    function(err, result) {
      if (err) throw err;
      console.table(result);
      // re-prompt the user
      start();
    }
  );
}