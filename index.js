const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeeTracker_DB",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// What would you like to do?
// View all employees by manager
  // Filter by manager => OUTER JOIN
// Add employee
  // First Name
  // Last Name
  // Role
    // Required list of roles to choose from
  // Manager
    // Require list of managers to choose from and an option of "none"
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
      choices: [
        "View all employees",
        "View all employees by department",
        "View all employees by manager",
        "Add employee",
        "Remove employee",
        "Update employee role",
        "Update employee manager",
        "View all roles",
        "Exit",
      ],
    })
    .then(function (answer) {
      // based on their answer, call the function relevant to the option selected
      switch (answer.databaseOptions) {
        case "View all employees":
          listEmployees();
          break;
        case "View all employees by department":
          listEmployeesByDepartment();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

// View all employees
  // id
  // first_name
  // last_name
  // title
  // department
  // salary
  // manager

// Returns a formatted table showing all employees
const listEmployees = () => {
  connection.query("SELECT emps.id, emps.first_name, emps.last_name, role.title AS Role, dept.name AS Department, role.salary AS Salary, concat(mgrs.first_name, ' ', mgrs.last_name) AS Manager FROM employee emps LEFT JOIN employee mgrs ON emps.manager_id = mgrs.id LEFT JOIN role ON emps.role_id = role.id LEFT JOIN department dept ON role.department_id = dept.id;", function (
    err,
    result
  ) {
    if (err) {
      throw err;
    } else {
      console.table(result);
    }
    // re-prompt the user
    start();
  });
}

// View all employees by department
  // Filter by department => OUTER JOIN

// Returns a formatted table showing all employees by the department selected
const listEmployeesByDepartment = () => {
  connection.query(
    "SELECT employee.id, first_name, last_name, role_id, manager_id, department.id, department.name FROM ((employeeTracker_DB.employee RIGHT JOIN employeeTracker_DB.role ON role_id = role.id) RIGHT JOIN employeeTracker_DB.department ON department_id = department.id)",
    function (err, result) {
      if (err) throw err;
      console.table(result);
      // re-prompt the user
      start();
    }
  );
}
