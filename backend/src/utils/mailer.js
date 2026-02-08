const { Resend } = require('resend');

// Usamos la API de Resend en lugar de SMTP (Nodemailer)
const resend = new Resend(process.env.RESEND_API_KEY);

const enviarNotificacionNuevoAdmin = async (nombre, emailAdmin) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'JG Service <onboarding@resend.dev>', // Email de prueba por defecto
      to: emailAdmin,
      subject: '¡Bienvenido al Panel - JG Service!',
      html: `<h2>Hola, ${nombre}</h2><p>Has sido registrado como admin.</p>`
    });

    if (error) {
      console.error("❌ Error de Resend:", error);
      throw error;
    }

    console.log("✅ Correo enviado vía API:", data.id);
    return data;
  } catch (err) {
    console.error("❌ Falló el envío por API:", err.message);
    throw err;
  }
};

module.exports = { enviarNotificacionNuevoAdmin };