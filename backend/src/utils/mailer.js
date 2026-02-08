const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarNotificacionNuevoAdmin = async (nombreNuevoAdmin, emailNuevoAdmin) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'JG Service <onboarding@resend.dev>',
      
      to: 'johan020497@gmail.com', 
      subject: '🔔 Alerta: Nuevo Administrador Registrado',
      html: `
        <div style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Notificación de Sistema</h2>
          <p>Se ha registrado un nuevo administrador en la plataforma:</p>
          <ul style="background-color: #1e293b; padding: 15px; border-radius: 5px; list-style: none;">
            <li><strong>Nombre:</strong> ${nombreNuevoAdmin}</li>
            <li><strong>Email:</strong> ${emailNuevoAdmin}</li>
          </ul>
          <p style="margin-top: 20px; font-size: 0.8em; color: #94a3b8;">
            Este es un aviso automático enviado a tu cuenta principal.
          </p>
        </div>
      `
    });

    if (error) {
      console.error("❌ Error de Resend:", error.message);
      return null;
    }

    console.log("✅ Notificación enviada a tu correo principal:", data.id);
    return data;
  } catch (err) {
    console.error("❌ Falló el envío de la notificación:", err.message);
    return null;
  }
};

module.exports = { enviarNotificacionNuevoAdmin };