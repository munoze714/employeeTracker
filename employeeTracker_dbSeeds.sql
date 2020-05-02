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

INSERT INTO department (name) VALUES ('Sales'),('Enginering'),('Finance'),('Legal');
INSERT INTO role (title , salary,departmentId) VALUES ('Sales Lead',1000000,1),('Salesperson', 80000,1),('Lead Engineer',150000,2),('Software Engineer',120000,2),('Accountant',125000,3),('Legal Team Lead',250000,4), ('Lawyer',190000,4);
INSERT INTO employee (firstName, lastName,roleId,managerId) VALUES ('Liz',' Munoz',1,null),('David','Lovett',3,null),('Kevin','Tupik',4,2),('Mike','Chan',2,1),('Sarah','Lourd',6,null),('Tom','Allen',7,3);





