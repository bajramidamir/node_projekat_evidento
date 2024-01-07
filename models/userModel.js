const pg = require('pg');
require('dotenv').config();


const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
};

const pool = new pg.Pool(config);


async function insertUser(username, password, role, firstName, lastName) {
    const client = await pool.connect();
    try {
        const result = await client.query("INSERT INTO users(username, password, role, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *", [username, password, role, firstName, lastName]);
        return result.rows[0];
    } finally {
        client.release();
    }
};

async function getUserByUsername(username) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
        return result.rows[0];
    } finally {
        client.release();
    }
};

async function getAllUsers() {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM users WHERE username != 'admin';");
        return result.rows;
    } finally {
        client.release();
    };
};

async function getAllEmployees() {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM users WHERE role = 'employee';");
        return result.rows;
    } finally {
        client.release();
    };
};

async function getAllProjectManagers() {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM users WHERE role = 'project manager';");
        return result.rows;
    } finally {
        client.release();
    };
};

async function deleteUserByUsername(username) {
    const client = await pool.connect();
    try {
        const result = await client.query("DELETE FROM users WHERE username = $1", [username]);
    } finally {
        client.release();
    };
};

async function updateUser(username, newUsername, newRole) {
    const client = await pool.connect();
    try {
        const result = await client.query("UPDATE users SET username = $1, role = $2 WHERE username = $3;", [newUsername, newRole, username]);
    } finally {
        client.release();
    };
};

async function getUserCount() {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT count(*) FROM users");
        return result.rows[0];
    } finally {
        client.release();
    };
};

async function getUserIdByUsername(username) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT user_id FROM users WHERE username = $1", [username]);
        return result.rows[0];
    } finally {
        client.release();
    };
};

module.exports = { 
    getUserByUsername,
    insertUser,
    getAllUsers,
    getAllEmployees,
    getAllProjectManagers,
    deleteUserByUsername,
    updateUser,
    getUserCount,
    getUserIdByUsername
};