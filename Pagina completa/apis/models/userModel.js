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

    // 🔹 Nuevo método para actualizar datos por ID
    static async updateById(id, updateData, table) {
    // Filtrar solo los campos que tienen valor definido
    const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );

    const query = `UPDATE ${table} SET ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [filteredData, id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}
}
module.exports = User;
