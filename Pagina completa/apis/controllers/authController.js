const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Propietario = require("../models/Propietario");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

// Almacena intentos por IP (en memoria)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutos en milisegundos

// Función para generar auth_id
const generateAuthId = () => {
  return "auth_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};

// Función para obtener IP del cliente
const getClientIP = (req) => {
  return (
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    "unknown-ip"
  );
};

class AuthController {
  static async register(req, res) {
    try {
      const isPropietario = req.originalUrl.includes("/register/propietario");
      const userType = isPropietario ? "propietario" : "usuario";
      const {
        nombre,
        email,
        contrasena,
        documento,
        telefono,
        fecha_nacimiento,
        rut,
      } = req.body;

      // Verificar si el usuario ya existe
      let existingUser;
      if (userType === "propietario") {
        existingUser = await Propietario.findOne({ email });
      } else {
        existingUser = await Usuario.findOne({ email });
      }

      if (existingUser) {
        console.log("Usuario ya existe:", email);
        return res.status(409).json({
          success: false,
          message: "El usuario ya existe con este email",
        });
      }

      // Hash de la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

      // Crear usuario
      const userData = {
        nombre,
        email,
        contrasena: hashedPassword,
        documento: documento || null,
        telefono: telefono || null,
        fecha_nacimiento: fecha_nacimiento || null,
        auth_id: generateAuthId(),
        esta_activo: true,
        esta_verificado: false,
      };

      if (userType === "propietario") {
        userData.rut = rut || null;
      }

      let result;
      if (userType === "propietario") {
        result = await Propietario.create(userData);
      } else {
        result = await Usuario.create(userData);
      }

      res.status(201).json({
        success: true,
        message: `${userType === "propietario" ? "Propietario" : "Usuario"} registrado exitosamente`,
        data: {
          id: result._id,
          nombre,
          email,
        },
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, contrasena } = req.body;
      const clientIP = getClientIP(req);
      const attemptKey = `login_attempts_${clientIP}`;

      console.log("Intento de login desde IP:", clientIP, "Email:", email);

      // Verificar intentos previos
      const currentAttempts = loginAttempts.get(attemptKey) || {
        count: 0,
        lockUntil: null,
      };

      // Si está bloqueado por IP
      if (currentAttempts.lockUntil && Date.now() < currentAttempts.lockUntil) {
        const remainingTime = Math.ceil(
          (currentAttempts.lockUntil - Date.now()) / 1000 / 60,
        );
        console.log(
          "IP bloqueada:",
          clientIP,
          "Tiempo restante:",
          remainingTime,
          "minutos",
        );

        return res.status(429).json({
          success: false,
          message: `Demasiados intentos fallidos. Espere ${remainingTime} minutos antes de intentar nuevamente.`,
          locked: true,
          remainingTime: remainingTime,
        });
      }

      // Validar campos requeridos
      if (!email || !contrasena) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son requeridos",
        });
      }

      let user = null;
      let userType = null;
      let table = null;

      // Buscar primero en usuarios
      user = await Usuario.findOne({ email });
      if (user) {
        userType = "usuario";
        table = "usuarios";
      } else {
        // Si no está en usuarios, buscar en propietarios
        user = await Propietario.findOne({ email });
        if (user) {
          userType = "propietario";
          table = "propietarios";
        }
      }

      // Si no se encuentra en ninguna tabla
      if (!user) {
        console.log("Usuario no encontrado:", email);

        // Incrementar intentos fallidos por IP
        const newCount = currentAttempts.count + 1;
        let lockUntil = null;

        if (newCount >= MAX_ATTEMPTS) {
          lockUntil = Date.now() + LOCK_TIME;
          console.log("IP bloqueada por máximo intentos:", clientIP);
        }

        loginAttempts.set(attemptKey, {
          count: newCount,
          lockUntil: lockUntil,
        });

        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
          attemptsLeft: MAX_ATTEMPTS - newCount,
          locked: newCount >= MAX_ATTEMPTS,
        });
      }

      // Verificar si está activo
      if (!user.esta_activo) {
        return res.status(401).json({
          success: false,
          message: "Cuenta desactivada. Contacte al administrador",
        });
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

      if (!isPasswordValid) {
        console.log("Contraseña incorrecta para:", email);

        // Incrementar intentos fallidos por IP
        const newCount = currentAttempts.count + 1;
        let lockUntil = null;

        if (newCount >= MAX_ATTEMPTS) {
          lockUntil = Date.now() + LOCK_TIME;
          console.log("IP bloqueada por máximo intentos:", clientIP);
        }

        loginAttempts.set(attemptKey, {
          count: newCount,
          lockUntil: lockUntil,
        });

        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
          attemptsLeft: MAX_ATTEMPTS - newCount,
          locked: newCount >= MAX_ATTEMPTS,
        });
      }

      // Login exitoso - resetear intentos para esta IP
      if (loginAttempts.has(attemptKey)) {
        loginAttempts.delete(attemptKey);
        console.log("Intentos reseteados para IP:", clientIP);
      }

      // Crear token JWT
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          userType: userType,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      // Eliminar contraseña de la respuesta
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.contrasena;

      console.log(
        "Login exitoso para:",
        email,
        "Tipo:",
        userType,
        "Desde IP:",
        clientIP,
      );

      res.json({
        success: true,
        message: "Login exitoso",
        data: {
          user: userWithoutPassword,
          userType: userType,
          token: token,
          expiresIn: "24h",
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  static async getProfile(req, res) {
    try {
      // El usuario ya está autenticado por el middleware
      const user = req.user;
      const userType = req.userType;

      // Eliminar contraseña de la respuesta
      const userWithoutPassword = user.toObject ? user.toObject() : { ...user };
      delete userWithoutPassword.contrasena;

      res.json({
        success: true,
        message: "Perfil obtenido exitosamente",
        data: {
          user: userWithoutPassword,
          userType: userType,
        },
      });
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Usuario no encontrado en el token",
        });
      }

      // Mapeo frontend → backend
      const { username, email, telefono } = req.body;

      // Crear objeto con los campos a actualizar
      const fieldsToUpdate = {};
      if (username !== undefined) fieldsToUpdate.nombre = username;
      if (email !== undefined) fieldsToUpdate.email = email;
      if (telefono !== undefined) fieldsToUpdate.telefono = telefono;

      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No se recibieron campos para actualizar",
        });
      }

      const TargetModel =
        req.userType === "propietario" ? Propietario : Usuario;
      const updatedUser = await TargetModel.findByIdAndUpdate(
        userId,
        { $set: fieldsToUpdate },
        { new: true },
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado o datos iguales",
        });
      }

      const userData = updatedUser.toObject();
      delete userData.contrasena;

      res.json({
        success: true,
        message: "Perfil actualizado correctamente",
        data: userData,
      });
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
}

module.exports = AuthController;
