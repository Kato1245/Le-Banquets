const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Propietario = require("../models/Propietario");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");
const { sendResetEmail, sendWelcomeEmail } = require("../config/mailer");
const crypto = require("crypto");

// Almacena intentos por IP (en memoria)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutos en milisegundos

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

      // Verificar si el usuario ya existe en cualquiera de los roles
      const existingPropietario = await Propietario.findOne({ email });
      const existingUsuario = await Usuario.findOne({ email });

      if (existingPropietario || existingUsuario) {
        console.log("Email ya registrado:", email);
        return res.status(409).json({
          success: false,
          message: "El correo electrónico ya está registrado en el sistema",
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
        esta_activo: true,
        esta_verificado: false,
        notificaciones: {
          email: true,
          promociones: true,
          recordatorios: true,
          newsletter: false,
        },
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

      // Enviar el correo de bienvenida
      sendWelcomeEmail(email, nombre, userType === "propietario").catch(err => 
        console.error("No se pudo enviar el correo de bienvenida:", err)
      );

      // Crear token JWT para auto-login
      const token = jwt.sign(
        {
          userId: result._id,
          email: result.email,
          userType: userType,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Eliminar contraseña de la respuesta
      const userWithoutPassword = { ...userData };
      delete userWithoutPassword.contrasena;
      userWithoutPassword._id = result._id;

      res.status(201).json({
        success: true,
        message: `${userType === "propietario" ? "Propietario" : "Usuario"} registrado exitosamente`,
        data: {
          user: userWithoutPassword,
          userType: userType,
          token: token,
          expiresIn: "24h",
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

      // Campos enviados desde el frontend
      const {
        nombre,
        email,
        telefono,
        fecha_nacimiento,
        documento,
        notificaciones,
      } = req.body;

      // Crear objeto con los campos a actualizar
      const fieldsToUpdate = {};
      if (nombre !== undefined) fieldsToUpdate.nombre = nombre;
      if (email !== undefined) fieldsToUpdate.email = email;
      if (telefono !== undefined) fieldsToUpdate.telefono = telefono;
      if (fecha_nacimiento !== undefined)
        fieldsToUpdate.fecha_nacimiento = fecha_nacimiento;
      if (documento !== undefined) fieldsToUpdate.documento = documento;
      if (notificaciones !== undefined)
        fieldsToUpdate.notificaciones = notificaciones;

      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No se recibieron campos para actualizar",
        });
      }

      // Validar si el email nuevo ya existe
      if (fieldsToUpdate.email) {
        const existingPropietario = await Propietario.findOne({
          email: fieldsToUpdate.email,
          _id: { $ne: userId },
        });
        const existingUsuario = await Usuario.findOne({
          email: fieldsToUpdate.email,
          _id: { $ne: userId },
        });

        if (existingPropietario || existingUsuario) {
          return res.status(409).json({
            success: false,
            message: "El correo electrónico ya está en uso por otra cuenta",
          });
        }
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
        error: error.message
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Usuario no encontrado en el token",
        });
      }

      const { actual, nueva } = req.body;
      if (!actual || !nueva) {
        return res.status(400).json({
          success: false,
          message: "Debe proporcionar la contraseña actual y la nueva",
        });
      }

      const TargetModel =
        req.userType === "propietario" ? Propietario : Usuario;
      const user = await TargetModel.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(actual, user.contrasena);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "La contraseña actual es incorrecta",
        });
      }

      // Nueva validación: la contraseña nueva no puede ser igual a la actual
      const isSamePassword = await bcrypt.compare(nueva, user.contrasena);
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          message: "La nueva contraseña no puede ser igual a la anterior",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(nueva, saltRounds);

      await TargetModel.findByIdAndUpdate(userId, {
        contrasena: hashedPassword,
      });

      res.json({
        success: true,
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  }

  static async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No se recibió ninguna imagen",
        });
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Usuario no encontrado en el token",
        });
      }

      // Convertir buffer a Base64 Data URL
      const base64 = req.file.buffer.toString("base64");
      const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

      const TargetModel =
        req.userType === "propietario" ? Propietario : Usuario;

      const updatedUser = await TargetModel.findByIdAndUpdate(
        userId,
        { $set: { foto_perfil: dataUrl } },
        { new: true },
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      res.json({
        success: true,
        message: "Foto de perfil actualizada",
        data: { foto_perfil: dataUrl },
      });
    } catch (error) {
      console.error("Error subiendo avatar:", error);
      res.status(500).json({
        success: false,
        message: "Error interno al subir la imagen",
      });
    }
  }
  static async deleteAccount(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Usuario no encontrado en el token",
        });
      }

      const { contrasena } = req.body;
      if (!contrasena) {
        return res.status(400).json({
          success: false,
          message: "La contraseña es requerida para eliminar la cuenta",
        });
      }

      // Verificar contraseña actual
      const isValid = await bcrypt.compare(contrasena, req.user.contrasena);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Contraseña incorrecta" });
      }

      const TargetModel =
        req.userType === "propietario" ? Propietario : Usuario;
      await TargetModel.findByIdAndDelete(userId);

      res.json({ success: true, message: "Cuenta eliminada correctamente" });
    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: "El email es requerido" });
      }

      // Buscar en ambas tablas
      let user = await Usuario.findOne({ email });
      let userType = "usuario";

      if (!user) {
        user = await Propietario.findOne({ email });
        userType = "propietario";
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "El correo electrónico no se encuentra registrado",
        });
      }

      // Generar código de 6 dígitos
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

      // Guardar en el modelo correspondiente
      const TargetModel = userType === "propietario" ? Propietario : Usuario;
      await TargetModel.findByIdAndUpdate(user._id, {
        reset_password_token: resetCode,
        reset_password_expires: expires
      });

      // Enviar email
      const emailSent = await sendResetEmail(email, resetCode, user.nombre);

      if (emailSent.success) {
        res.json({ success: true, message: "Código enviado correctamente" });
      } else {
        res.status(500).json({ success: false, message: "Error al enviar el correo" });
      }
    } catch (error) {
      console.error("Error en forgotPassword:", error);
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { email, code, nuevaContrasena } = req.body;

      if (!email || !code || !nuevaContrasena) {
        return res.status(400).json({ success: false, message: "Todos los campos son requeridos" });
      }

      // Buscar usuario con el código y que no haya expirado
      let user = await Usuario.findOne({
        email,
        reset_password_token: code,
        reset_password_expires: { $gt: Date.now() }
      });
      let userType = "usuario";

      if (!user) {
        user = await Propietario.findOne({
          email,
          reset_password_token: code,
          reset_password_expires: { $gt: Date.now() }
        });
        userType = "propietario";
      }

      if (!user) {
        return res.status(400).json({ success: false, message: "Código inválido o expirado" });
      }

      // Actualizar contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(nuevaContrasena, saltRounds);

      const TargetModel = userType === "propietario" ? Propietario : Usuario;
      await TargetModel.findByIdAndUpdate(user._id, {
        contrasena: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null
      });

      res.json({ success: true, message: "Contraseña actualizada con éxito" });
    } catch (error) {
      console.error("Error en resetPassword:", error);
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }
}

module.exports = AuthController;
