const db = require('../config/database');

class User {
    static async createUser(userData, table) {
        const query = `INSERT INTO ${table} SET ?`;
        return new Promise((resolve, reject) => {
            db.query(query, userData, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static async findByEmail(email, table) {
        const query = `SELECT * FROM ${table} WHERE email = ?`;
        return new Promise((resolve, reject) => {
            db.query(query, [email], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static async findById(id, table) {
        const query = `SELECT * FROM ${table} WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }
}

module.exports = User;