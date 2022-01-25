const inquirer = require('inquirer');
const mysql = require('mysql');
const {config} = require("./creds");

const connection = mysql.createConnection(config);

//this project uses inquirer to promt things in the console for the user to respond to
const start = () => {
    inquirer
    //this is how you indicated a prompt
      .prompt({
        name: 'action',
        type: 'list',
        message: 'Welcome to the employee management system what would you like to do?',
        choices: ['Add Departments', 'Add Roles', 'Add Employee','View Departments', 'View Roles', 'View Employee', 'Update Roles', 'logout'],
      })
      //you add a switch statement or a if else statement to continue the prompts depending on user input
      .then(({action}) => {
        switch(action){
          case "Add Departments":
            addDepartment();
            break;
          case "Add Roles":
            addRole();
            break;
          case "Add Employee":
            addEmployee();
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
//this collects the information needed to add a department and then adds the department
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
//this collects the information needed to add a role and then adds the role
const addRole = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;

    inquirer.prompt([
        {
            name: "role",
            message: "What role would you like to add?"
            
        },
        {
            name: "salary",
            message: "What is the salary of this role?"
            
        },
        //this pulls the already existing data in the data base to populate a list of optuions for the user
        {
            type: 'rawlist',
            name: "roleDepartment",
            message: "What department does this role belong to?",
            choices() {
                const choiceArray = [];
                results.forEach(({ id}) => {
                  choiceArray.push(id);
                });
                return choiceArray;
              },
        }

    ])
    .then((answer) => {
        console.log(answer)
        connection.query(
          'INSERT INTO roles SET ?',
          {
            title: answer.role,
            salary: answer.salary,
            departmentID: answer.roleDepartment
          },
          (err) => {
            if (err) throw err;
            console.log('The role was added successfully!');
            start();
          }
        );
      });
    });
};
//this collects the information needed to add a employee and then adds the employee
const addEmployee = () => {
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) throw err;
        connection.query('SELECT * FROM employees', (err, results2) => {
            if (err) throw err;

    inquirer.prompt([
        {
            name: "firstName",
            message: "What is the employees first name?"
            
        },
        {
            name: "lastName",
            message: "What is the employees last name?"
            
        },
        {
            type: 'rawlist',
            name: "role",
            message: "What is the role of this employee?",
            choices() {
                const choiceArray = [];
                results.forEach(({id}) => {
                  choiceArray.push(id);
                });
                return choiceArray;
              },
        },
        //this populates a list of other employees that could be the new employees managner
        {
            type: 'rawlist',
            name: "manager",
            message: "Who is the manager of this employee?",
            choices() {
                const choiceArray = [];
                results2.forEach(({id}) => {
                  choiceArray.push(id);
                });
                choiceArray.push("no manager");
                return choiceArray;
              },
        }

    ])
    .then((answer) => {
        console.log(answer)
        if (answer.manager === "no manager") {
        connection.query(
          'INSERT INTO employees SET ?',
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.role
          },
          (err) => {
            if (err) throw err;
            console.log('The employee was added successfully!');
            start();
          }
        );}
        else {
            connection.query(
                'INSERT INTO employees SET ?',
                {
                  first_name: answer.firstName,
                  last_name: answer.lastName,
                  role_id: answer.role,
                  manager_id: answer.manager
                },
                (err) => {
                  if (err) throw err;
                  console.log('The employee was added successfully!');
                  start();
                }
              );
        }
      });
    });});
};
//these are the view options which uses a select query and the * means all in this case
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
 const updateRoles = () => {
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) throw err;
        inquirer
      .prompt([
        {
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({title}) => {
              choiceArray.push(title);
            });
            return choiceArray;
          },
          message: 'Which role would you like to update?',
        },
        {
            name: "newSalary",
            message: "What is the new salary?"
            
        }

      ])
      .then((answer) => {
        let chosenRole;
        results.forEach((role) => {
          if (role.title === answer.choice) {
            chosenRole = role;
          }
        });
        connection.query(
            'UPDATE roles SET ? WHERE ?',
            [
              {
                salary:  parseInt(answer.newSalary),
              },
              {
                id: chosenRole.id,
              },
            ],
            (error) => {
              if (error) throw err;
              start();
            });
        ;})
 });
}



  start();