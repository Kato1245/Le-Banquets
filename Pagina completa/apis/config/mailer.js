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

const sendReservationRequestEmail = async (propietarioEmail, reservaData) => {
  try {
    const { banqueteNombre, clienteNombre, fecha, hora, monto, detalles } = reservaData;
    const mailOptions = {
      from: `"Le Banquets" <${process.env.EMAIL_USER}>`,
      to: propietarioEmail,
      subject: "Nueva solicitud de reserva - Le Banquets",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4a90e2; text-align: center;">Nueva Solicitud de Reserva</h2>
          <p>Hola,</p>
          <p>Has recibido una nueva solicitud de reserva para tu banquete <strong>"${banqueteNombre}"</strong>.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4a90e2;">
            <p style="margin: 5px 0;"><strong>Cliente:</strong> ${clienteNombre}</p>
            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date(fecha).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Hora:</strong> ${hora}</p>
            <p style="margin: 5px 0;"><strong>Costo Estimado:</strong> $${monto.toLocaleString()}</p>
            ${detalles ? `<p style="margin: 5px 0;"><strong>Detalles:</strong> ${detalles}</p>` : ""}
          </div>
          
          <p>Por favor, ingresa a tu panel de propietario para confirmar o rechazar esta solicitud.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/perfil?tab=reservas" style="background-color: #4a90e2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver Reservas</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">Este es un mensaje automático de Le Banquets.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo de reserva enviado: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error enviando correo de reserva:", error);
    return { success: false, error };
  }
};

const sendReservationStatusEmail = async (usuarioEmail, data) => {
  try {
    const { nombreUsuario, banqueteNombre, estado, motivo_rechazo, fecha, hora } = data;
    const esAceptada = estado === "confirmada";

    const mailOptions = {
      from: `"Le Banquets" <${process.env.EMAIL_USER}>`,
      to: usuarioEmail,
      subject: `Actualización de tu reserva: ${esAceptada ? 'Confirmada' : 'Cancelada'} - Le Banquets`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: ${esAceptada ? '#27ae60' : '#e74c3c'}; text-align: center;">Tu Reserva ha sido ${esAceptada ? 'Confirmada' : 'Cancelada'}</h2>
          <p>Hola <strong>${nombreUsuario}</strong>,</p>
          <p>Tenemos una actualización sobre tu reserva para <strong>"${banqueteNombre}"</strong>.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${esAceptada ? '#27ae60' : '#e74c3c'};">
            <p style="margin: 5px 0;"><strong>Banquete:</strong> ${banqueteNombre}</p>
            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date(fecha).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Hora:</strong> ${hora}</p>
            <p style="margin: 5px 0;"><strong>Estado:</strong> <span style="text-transform: uppercase; font-weight: bold; color: ${esAceptada ? '#27ae60' : '#e74c3c'};">${estado}</span></p>
            ${!esAceptada && motivo_rechazo ? `<p style="margin: 5px 0; color: #e74c3c;"><strong>Motivo:</strong> ${motivo_rechazo}</p>` : ""}
          </div>
          
          <p>${esAceptada ? '¡Estamos listos para recibirte! Puedes ver los detalles en tu perfil.' : 'Lamentamos que tu reserva no haya podido ser procesada en esta ocasión.'}</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/perfil?tab=reservas" style="background-color: ${esAceptada ? '#27ae60' : '#e74c3c'}; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver mis Reservas</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">Este es un mensaje automático de Le Banquets.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo de estado de reserva enviado: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error enviando correo de estado de reserva:", error);
    return { success: false, error };
  }
};

const sendAppointmentStatusEmail = async (usuarioEmail, data) => {
  try {
    const { nombreUsuario, banqueteNombre, estado, motivo_rechazo, fecha, hora } = data;
    const esAceptada = estado === "confirmada";

    const mailOptions = {
      from: `"Le Banquets" <${process.env.EMAIL_USER}>`,
      to: usuarioEmail,
      subject: `Actualización de tu cita: ${esAceptada ? 'Aceptada' : 'Rechazada'} - Le Banquets`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: ${esAceptada ? '#27ae60' : '#e74c3c'}; text-align: center;">Tu Cita ha sido ${esAceptada ? 'Aceptada' : 'Rechazada'}</h2>
          <p>Hola <strong>${nombreUsuario}</strong>,</p>
          <p>El propietario de <strong>"${banqueteNombre}"</strong> ha respondido a tu solicitud de cita.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${esAceptada ? '#27ae60' : '#e74c3c'};">
            <p style="margin: 5px 0;"><strong>Banquete:</strong> ${banqueteNombre}</p>
            <p style="margin: 5px 0;"><strong>Fecha sugerida:</strong> ${new Date(fecha).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Hora sugerida:</strong> ${hora}</p>
            <p style="margin: 5px 0;"><strong>Estado:</strong> <span style="text-transform: uppercase; font-weight: bold; color: ${esAceptada ? '#27ae60' : '#e74c3c'};">${estado === 'confirmada' ? 'ACEPTADA' : 'RECHAZADA'}</span></p>
            ${!esAceptada && motivo_rechazo ? `<p style="margin: 5px 0; color: #e74c3c;"><strong>Motivo:</strong> ${motivo_rechazo}</p>` : ""}
          </div>
          
          <p>${esAceptada ? '¡La cita ha sido confirmada! El anfitrión te espera en la fecha y hora acordadas.' : 'La cita no pudo ser confirmada. Puedes intentar sugerir otro horario.'}</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/perfil?tab=citas" style="background-color: ${esAceptada ? '#27ae60' : '#e74c3c'}; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver mis Citas</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">Este es un mensaje automático de Le Banquets.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo de estado de cita enviado: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error enviando correo de estado de cita:", error);
    return { success: false, error };
  }
};

module.exports = { sendResetEmail, sendReservationRequestEmail, sendReservationStatusEmail, sendAppointmentStatusEmail };
