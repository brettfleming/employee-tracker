const inquirer = require('inquirer');
const mysql = require('mysql');
const {config} = require("./creds");

const connection = mysql.createConnection(config);


const start = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'Welcome to the employee management system what would you like to do?',
        choices: ['Add Departments', 'Add Roles', 'Add Employee','View Departments', 'View Roles', 'View Employee', 'Update Roles', 'logout'],
      })
      .then(({action}) => {
        switch(action){
          case "Add Departments":
            addDepartment();
            break;
          case "Add Roles":
            console.log("Access Denied!!!");
            break;
          case "Add Employee":
            console.log("Access Denied!!!");
            break;
          case "View Departments":
            viewDepartments();
            break;
          case "View Roles":
            viewRoles();
            break;
          case "View Employee":
            viewEmployee();
            break;
          case "Update Roles":
            updateRoles();
            break;
          case "logout":
            connection.end();
            break;
        }
      })
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: "department",
            message: "What department would you like to add?"
            
        }
    ])
    .then((answer) => {
        connection.query(
          'INSERT INTO department SET ?',
          {
            name: answer.department,
            
          },
          (err) => {
            if (err) throw err;
            console.log('The department was added successfully!');
            start();
          }
        );
      });
};

const viewDepartments = () => {
    connection.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();})
 };
 const viewEmployee = () => {
    connection.query(`SELECT * FROM employees`, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();})
 };
 const viewRoles = () => {
    connection.query(`SELECT * FROM roles`, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();})
 };



  start();