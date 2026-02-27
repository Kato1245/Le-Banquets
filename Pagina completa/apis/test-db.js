const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
require('dotenv').config();

async function testDBs() {
    console.log('Testing connections...');

    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'le_banquets_1',
        });
        const conn = await pool.getConnection();
        console.log('✅ MySQL Connected');
        conn.release();
        await pool.end();
    } catch (err) {
        console.error('❌ MySQL Error:', err.message);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/le_banquets");
        console.log('✅ MongoDB Connected');
        await mongoose.connection.close();
    } catch (err) {
        console.error('❌ MongoDB Error:', err.message);
    }

    process.exit(0);
}

testDBs();
