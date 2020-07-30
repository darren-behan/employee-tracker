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
  password: "Andrew1312",
  database: "employeeTracker_DB",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// Update employee role
// List employees
// List roles to update for employee
// Update employee manager
// List employees
// List managers to update for employee
// View all roles

// * Add departments
// * View departments
// * Update employee roles

// console.log() if operation was successful => example: "${first_name} ${last_name} has been added"

// Start function to prompt the user on what they would like to see in the employee tracker
const start = () => {
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
        "View all roles",
        "Add a role",
        "View all departments",
        "Add a department",
        "Exit",
      ],
    })
    .then(function (answer) {
      // based on the users answer, call the function relevant to the option selected
      switch (answer.databaseOptions) {
        case "View all employees":
          listEmployees();
          break;
        case "View all employees by department":
          listEmployeesByDepartment();
          break;
        case "View all employees by manager":
          listEmployeesByManager();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Remove employee":
          removeEmployee();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "Add a role":
          addRole();
          break;
        case "View all departments":
          viewAllDepartments();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

// Returns a formatted table showing all employees
const listEmployees = () => {
  connection.query(
    "SELECT emps.id, emps.first_name, emps.last_name, role.title AS Role, dept.name AS Department, role.salary AS Salary, concat(mgrs.first_name, ' ', mgrs.last_name) AS Manager FROM employee emps LEFT JOIN employee mgrs ON emps.manager_id = mgrs.id LEFT JOIN role ON emps.role_id = role.id LEFT JOIN department dept ON role.department_id = dept.id;",
    function (err, result) {
      if (err) {
        throw err;
      } else {
        console.table(result);
      }
      // re-prompt the user
      start();
    }
  );
};

// Returns a formatted table showing all employees under the department selected
const listEmployeesByDepartment = () => {
  connection.query("SELECT * FROM employeeTracker_DB.department;", (
    err,
    result
  ) => {
    if (err) {
      throw err;
    }
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Please choose a department:",
        choices: result.map((department) => department.name),
      })
      .then((answer) => {
        const query =
          "SELECT emps.id, emps.first_name, emps.last_name, role.title AS Role, dept.name AS Department, role.salary AS Salary, concat(mgrs.first_name, ' ', mgrs.last_name) AS Manager FROM department dept LEFT JOIN role ON role.department_id = dept.id LEFT JOIN employee emps ON emps.role_id = role.id LEFT JOIN employee mgrs ON emps.manager_id = mgrs.id WHERE dept.name = ?;";
          connection.query(query, [answer.department], (err, res) => {
            if (err) throw err;
            console.table(res);
            // re-prompt the user
            start();
        });
      });
  });
};

// Returns a formatted table showing all employees reporting into the manager selected
const listEmployeesByManager = () => {
  connection.query("SELECT DISTINCT concat(mgrs.first_name, ' ', mgrs.last_name) AS Manager FROM employee emps LEFT JOIN employee mgrs ON emps.manager_id = mgrs.id WHERE concat(mgrs.first_name, ' ', mgrs.last_name) IS NOT NULL;", (
    err,
    result
  ) => {
    if (err) {
      throw err;
    }
    inquirer
      .prompt({
        name: "manager",
        type: "list",
        message: "Please choose a manager:",
        choices: result.map((manager) => manager.Manager),
      })
      .then((answer) => {
        const query =
          "SELECT emps.id, emps.first_name, emps.last_name, role.title AS Role, dept.name AS Department, role.salary AS Salary, concat(mgrs.first_name, ' ', mgrs.last_name) AS Manager FROM department dept LEFT JOIN role ON role.department_id = dept.id LEFT JOIN employee emps ON emps.role_id = role.id LEFT JOIN employee mgrs ON emps.manager_id = mgrs.id WHERE concat(mgrs.first_name, ' ', mgrs.last_name) = ?;";
          connection.query(query, [answer.manager], (err, res) => {
            if (err) throw err;
            console.table(res);
            // re-prompt the user
            start();
        });
      });
  });
};

// Add a new employee
const addEmployee = () => {
  connection.query("SELECT DISTINCT emps.id, CONCAT(first_name, ' ', last_name) AS Manager, role.id, role.title FROM employee emps LEFT JOIN role ON emps.role_id = role.id", (err, result) => {
    if (err) throw err;
    inquirer
    .prompt([
    {
      name: "firstName",
      type: "input",
      message: "Enter the new employees first name:"
    },
    {
      name: "lastName",
      type: "input",
      message: "Enter the new employees last name:"
    },
    {
      name: "manager",
      type: "list",
      message: "Please choose the employees manager:",
      choices: result.map(manager => manager.Manager) // Require an option of "none" to be added
    },
    {
      name: "role",
      type: "list",
      message: "Please choose the employees role:",
      choices: result.map(role => role.title) // Require an option of "none" to be added
    }
    ]).then((answer) => {
      const query =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, (SELECT id FROM role WHERE title = ? ), (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name,' ',last_name) = ? ) AS tmptable));";
        connection.query(query, [answer.firstName, answer.lastName, answer.role, answer.manager ], (err, res) => {
          if (err) throw err;
          console.log("Added successfully!");
          // re-prompt the user
          start();
      });
    });
  });
};

// Remove employee
const removeEmployee = () => {
  connection.query("SELECT concat(first_name,' ',last_name) AS Name FROM employeeTracker_DB.employee", (err, result) => {
    if (err) throw err;
    inquirer
    .prompt([
    {
      name: "employee",
      type: "list",
      message: "Choose the employee that you want to remove:",
      choices: result.map(employee => employee.Name) // Require an option of "none" to be added
    }
    ]).then((answer) => {
      const query =
        "DELETE FROM employee WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name,' ',last_name) = ?) AS tmptable)";
        connection.query(query, [answer.employee], (err, res) => {
          if (err) throw err;
          console.log("Removed successfully!");
          // re-prompt the user
          start();
      });
    });
  });
};

// View all roles
const viewAllRoles = () => {
  const query =
    "SELECT title AS 'Title' FROM role";
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      // re-prompt the user
      start();
  });
}

// Add a role
const addRole = () => {
  connection.query("SELECT name FROM employeeTracker_DB.department;", (err, result) => {
    if (err) throw err;
    inquirer
    .prompt([
    {
      name: "title",
      type: "input",
      message: "Enter the new role title:"
    },
    {
      name: "salary",
      type: "input",
      message: "Enter the new salary for the role:"
    },
    {
      name: "department",
      type: "list",
      message: "Please choose the department the role sits under:",
      choices: result.map(department => department.name) // Require an option of "none" to be added
    }
    ]).then((answer) => {
      const query =
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE name = ? ));";
        connection.query(query, [answer.title, answer.salary, answer.department], (err, res) => {
          if (err) throw err;
          console.log("Added successfully!");
          // re-prompt the user
          start();
      });
    });
  });
}

// View all departments
const viewAllDepartments = () => {
  const query =
    "SELECT name AS 'Name' FROM department";
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      // re-prompt the user
      start();
  });
}

