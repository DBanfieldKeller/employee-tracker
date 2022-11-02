const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password protected with dotenv
        password: process.env.PASSWORD,
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

// inquirer functions



// query functions

// view all departments

const viewDepartments = () => {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results)
    })
}

// view all roles

const viewRoles = () => {
    const sqlQuery =
        `SELECT r.id,
        r.title,
        r.salary,
        d.department_name
        FROM roles r
        JOIN department d on d.id = r.department_id
        ORDER BY r.id ASC;`

    db.query(sqlQuery, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results)
    })
}

// view all employees
const viewEmployees = () => {
    const sqlQuery =
        `SELECT e.id,
        e.first_name,
        e.last_name,
        r.title,
        d.department_name,
        CONCAT (m.first_name, ' ', m.last_name) AS Manager
        FROM employee e
        LEFT JOIN employee m on m.id = e.manager_id
        JOIN roles r on r.id = e.role_id
        JOIN department d on d.id = r.department_id
        ORDER BY e.id ASC;`;

    db.query(sqlQuery, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results)
    })
}

// add a department

// add a role

const addRole = () => {
    const sqlQuery = 'SELECT * FROM department'
    db.query(sqlQuery, (err, response) => {
        if (err) throw err;
        let deptNamesArray = [];
        response.forEach((department) => {deptNamesArray.push(department.department_name);});
        deptNamesArray.push('New Department');
        inquirer
          .prompt([
            {
              name: 'deptName',
              type: 'list',
              message: 'Which department?',
              choices: deptNamesArray
            }
          ])
          .then((answer) => {
            if (answer.departmentName === 'New Department') {
              this.addDepartment();
            } else {
              addRoleResume(answer);
            }
          });
  
        const addRoleResume = (departmentData) => {
          inquirer
            .prompt([
              {
                name: 'newRole',
                type: 'input',
                message: 'What is the name of your new role?',
              },
              {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this new role?',
              }
            ])
            .then((answer) => {
              const createdRole = answer.newRole;
              let departmentId;
  
              response.forEach((department) => {
                if (departmentData.deptName === department.department_name) {departmentId = department.id;}
              });
  
              let sql =   `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
              let crit = [createdRole, answer.salary, departmentId];
  
              db.query(sql, crit, (err) => {
                if (err) throw err;
                viewRoles();
              });
            });
        };
      });
    };

// add an employee

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: addFirstName => {
                if (addFirstName) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLastName => {
                if (addLastName) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const crit = [answer.firstName, answer.lastName]
            const roleSql = `SELECT r.id, r.title FROM roles r`;
            db.query(roleSql, (err, data) => {
                if (err) throw err;
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "Employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        crit.push(role);
                        const managerSql = `SELECT * FROM employee`;
                        db.query(managerSql, (error, data) => {
                            if (error) throw error;
                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    crit.push(manager);
                                    const sql = 
                                    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                                    db.query(sql, crit, (error) => {
                                        if (error) throw error;
                                        console.log("Employee has been added!")
                                        viewEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};


// update an employee role

// viewDepartments();
// viewEmployees();
// viewRoles();
addRole();


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});