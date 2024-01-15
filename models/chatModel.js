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

async function storeMessage(username, content) {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO chat_messages (username, content) VALUES ($1, $2)', [username, content]);
    } finally {
        client.release();
    };
};

async function getChatMessages() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM chat_messages ORDER BY timestamp ASC LIMIT 50');
        return result.rows;
    } finally {
        client.release();
    };
};

module.exports = {
    storeMessage,
    getChatMessages
}