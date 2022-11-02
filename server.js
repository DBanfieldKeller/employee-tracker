const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const figlet = require('figlet');
const consoleTable = require('console.table');
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
        // MySQL password
        password: process.env.PASSWORD,
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
