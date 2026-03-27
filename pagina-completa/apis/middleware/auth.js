// middleware/auth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "cad8e6396223f3bd0bf9ebcd1d66b983";

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
      });
    }

    // Verificar firma del token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificar expiración manualmente
    const now = Date.now().valueOf() / 1000;
    if (typeof decoded.exp !== "undefined" && decoded.exp < now) {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
      });
    }

    // Verificar que el usuario aún existe en BD
    let user;
    if (decoded.userType === "propietario") {
      const Propietario = require("../models/Propietario");
      user = await Propietario.findById(decoded.userId);
    } else {
      const Usuario = require("../models/Usuario");
      user = await Usuario.findById(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!user.esta_activo) {
      return res.status(401).json({
        success: false,
        message: "Cuenta desactivada",
      });
    }

    req.user = user;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    console.error("Error en autenticación:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Token expirado",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Token inválido",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error en autenticación",
    });
  }
};

module.exports = { authenticateToken, JWT_SECRET };
