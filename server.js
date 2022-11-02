const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const figlet = require('figlet');
const cTable = require('console.table');
const { sample } = require('rxjs');
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

// add an employee

// update an employee role

viewDepartments();
viewEmployees();
viewRoles();


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});