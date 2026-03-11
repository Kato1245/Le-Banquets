const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true para puerto 465, false para otros
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verificar conexión al iniciar
transporter.verify((error, success) => {
    if (error) {
        console.error("Error en configuración de mailer:", error);
    } else {
        console.log("Servidor de correos listo para enviar mensajes");
    }
});

const sendResetEmail = async (email, code, nombre) => {
    try {
        const mailOptions = {
            from: `"Le Banquets" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Código de recuperación - Le Banquets",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4a90e2; text-align: center;">Recuperación de Contraseña</h2>
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Has solicitado restablecer tu contraseña en Le Banquets. Utiliza el siguiente código para completar el proceso:</p>
          
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
          </div>
          
          <p>Este código expira en 15 minutos.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">Este es un mensaje automático, por favor no respondas a este correo.</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.error("Error enviando correo:", error);
        return { success: false, error };
    }
};

module.exports = { sendResetEmail };
