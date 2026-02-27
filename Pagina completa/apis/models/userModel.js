const pool = require('../config/database');

// Whitelist de tablas válidas para prevenir SQL injection
const ALLOWED_TABLES = ['usuarios', 'propietarios'];

function assertValidTable(table) {
    if (!ALLOWED_TABLES.includes(table)) {
        throw new Error(`Tabla no permitida: "${table}"`);
    }
}

class User {
    static async createUser(userData, table) {
        assertValidTable(table);
        const keys = Object.keys(userData);
        const values = Object.values(userData);
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.map(k => `\`${k}\``).join(', ');
        const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result;
    }

    static async findByEmail(email, table) {
        assertValidTable(table);
        const [rows] = await pool.execute(
            `SELECT * FROM ${table} WHERE email = ?`,
            [email]
        );
        return rows[0] || null;
    }

    static async findById(id, table) {
        assertValidTable(table);
        const [rows] = await pool.execute(
            `SELECT * FROM ${table} WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async updateById(id, updateData, table) {
        assertValidTable(table);

        // Filtrar campos vacíos o undefined
        const filtered = Object.fromEntries(
            Object.entries(updateData).filter(([, v]) => v !== undefined && v !== null)
        );

        if (Object.keys(filtered).length === 0) {
            throw new Error('No hay campos para actualizar');
        }

        const setParts = Object.keys(filtered).map(k => `\`${k}\` = ?`).join(', ');
        const values = [...Object.values(filtered), id];
        const query = `UPDATE ${table} SET ${setParts} WHERE id = ?`;
        const [result] = await pool.execute(query, values);
        return result;
    }
}

module.exports = User;
