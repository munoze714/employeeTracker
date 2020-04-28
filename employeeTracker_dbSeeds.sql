DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);


CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary INT,
  departmentId INT,
  PRIMARY KEY (id),
  FOREIGN KEY(departmentId) REFERENCES department(id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(30) NULL,
  lastName VARCHAR(30) NULL,
  roleId INT,
  managerId INT,
  PRIMARY KEY (id),
  FOREIGN KEY(roleID) REFERENCES role(id)
);




