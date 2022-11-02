const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const figlet = require('figlet');
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
    db.query('SELECT * FROM roles', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results)
    })
}

// view all employees
const viewEmployees = () => {
    db.query('SELECT * FROM employee', function (err, results) {
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