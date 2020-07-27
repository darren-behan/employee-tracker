DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE department
(
  id INT PRIMARY KEY
  AUTO_INCREMENT,
  name VARCHAR
  (30) NOT NULL
);

CREATE TABLE role
(
  id INT NOT NULL PRIMARY KEY
  AUTO_INCREMENT,
  title VARCHAR
  (30) NOT NULL,
  salary DECIMAL,
  department_id INT NOT NULL,
  CONSTRAINT fk_department FOREIGN KEY
  (department_id) REFERENCES department
  (id)
);

CREATE TABLE employee
(
  id INT NOT NULL
  AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR
  (30) NOT NULL,
  last_name VARCHAR
  (30) NOT NULL,
  role_id INT NOT NULL,
  CONSTRAINT fk_role FOREIGN KEY
  (role_id) REFERENCES role
  (id),
  manager_id INT, 
  CONSTRAINT fk_manager FOREIGN KEY
  (manager_id) REFERENCES employee
  (id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
