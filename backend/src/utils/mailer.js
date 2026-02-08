const nodemailer = require('nodemailer');
const dns = require('dns');

// Configuración del transportador (Usando Gmail como ejemplo)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  servername:'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // No es tu clave normal, es una generada por Google
  },
  tls: {
    // Esto ayuda a evitar errores de certificados al usar la IP directa
    rejectUnauthorized: false 
  },
  connectionTimeout: 10000, // Esperar hasta 10 segundos
  greetingTimeout: 10000,
  socketTimeout: 10000,
  dnsLookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, (err, address, family) => {
      callback(err, address, family);
    });
  }
});

const enviarNotificacionNuevoAdmin = async (nombre, emailAdmin) => {
  const mailOptions = {
    from: '"JG Service System" <johan020497@gmail.com>',
    to: emailAdmin, // El correo del nuevo admin
    subject: '¡Bienvenido al Panel de Administración - JG Service!',
    html: `
      <div style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; border-radius: 10px;">
        <h2 style="color: #3b82f6;">Hola, ${nombre}</h2>
        <p>Has sido registrado como administrador en <strong>JG Service</strong>.</p>
        <p>A partir de ahora puedes gestionar trabajos y noticias desde el panel de control.</p>
        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;">
        <small style="color: #94a3b8;">Si no esperabas este correo, por favor contacta al administrador principal.</small>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado con éxito a:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};

module.exports = { enviarNotificacionNuevoAdmin };