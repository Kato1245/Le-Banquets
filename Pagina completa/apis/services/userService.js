const User = require('../models/userModel');
const AppError = require('../utils/appError');

class UserService {
    static async findByEmail(email) {
        // Try to find in usuarios first
        let user = await User.findByEmail(email, 'usuarios');
        let userType = 'usuario';

        if (!user) {
            // Then try in propietarios
            user = await User.findByEmail(email, 'propietarios');
            userType = 'propietario';
        }

        return user ? { user, userType } : null;
    }

    static async findById(id, userType) {
        const table = userType === 'propietario' ? 'propietarios' : 'usuarios';
        return await User.findById(id, table);
    }

    static async createUser(userData, userType) {
        const table = userType === 'propietario' ? 'propietarios' : 'usuarios';
        return await User.createUser(userData, table);
    }

    static async updateUser(id, updateData, userType) {
        const table = userType === 'propietario' ? 'propietarios' : 'usuarios';
        return await User.updateById(id, updateData, table);
    }
}

module.exports = UserService;
