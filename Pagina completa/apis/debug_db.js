
const mongoose = require('mongoose');
require('dotenv').config();

const Propietario = require('./models/Propietario');
const Usuario = require('./models/Usuario');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // We don't know the exact user ID, so let's look for any user with recent activity or just list them
        const p = await Propietario.find().sort({ fecha_actualizacion: -1 }).limit(5);
        const u = await Usuario.find().sort({ fecha_actualizacion: -1 }).limit(5);

        console.log('Recent Propietarios:', JSON.stringify(p, null, 2));
        console.log('Recent Usuarios:', JSON.stringify(u, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
