import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
/**
 * Enviar correo con código OTP de 6 dígitos para inicio de sesión
 */
export async function sendOtpEmail(toEmail, otpCode) {
    try {
        const fromAddress = process.env.EMAIL_FROM || `"💍 Boda Admin" <${process.env.EMAIL_USER}>`;
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EBE3D5; border-radius: 10px; background-color: #FAF8F5;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #EBE3D5;">
          <h2 style="color: #4A3F35; margin: 0; font-family: Georgia, serif;">💍 Boda — Panel de Administración</h2>
          <p style="color: #888; font-size: 14px; margin-top: 5px;">Código de Verificación de Seguridad</p>
        </div>
        <div style="padding: 30px 20px; text-align: center;">
          <p style="color: #333; font-size: 16px;">Has solicitado un código de acceso para ingresar al panel administrativo de la boda.</p>
          <div style="margin: 30px 0; padding: 20px; background-color: #EBE3D5; border-radius: 8px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4A3F35;">${otpCode}</span>
          </div>
          <p style="color: #777; font-size: 14px;">Este código es válido por <strong>10 minutos</strong>. Si no solicitaste este código, puedes ignorar este correo de forma segura.</p>
        </div>
        <div style="text-align: center; border-top: 1px solid #EBE3D5; padding-top: 15px; color: #999; font-size: 12px;">
          © Boda — Panel de Control Protegido
        </div>
      </div>
    `;
        const info = await transporter.sendMail({
            from: fromAddress,
            to: toEmail,
            subject: `🔑 ${otpCode} es tu código de verificación — Boda Admin`,
            html: htmlContent,
        });
        console.log(`✅ [EMAIL SUCCESS] Correo de OTP enviado correctamente a ${toEmail} (ID: ${info.messageId})`);
        return true;
    }
    catch (error) {
        console.error("❌ [EMAIL ERROR] Error enviando correo OTP con nodemailer:", error);
        return false;
    }
}
/**
 * Enviar correo de invitación a un nuevo Administrador
 */
export async function sendAdminInviteEmail(toEmail, name, inviteLink) {
    try {
        const fromAddress = process.env.EMAIL_FROM || `"💍 Boda Admin" <${process.env.EMAIL_USER}>`;
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EBE3D5; border-radius: 10px; background-color: #FAF8F5;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #EBE3D5;">
          <h2 style="color: #4A3F35; margin: 0; font-family: Georgia, serif;">💍 Boda — Invitación de Administrador</h2>
        </div>
        <div style="padding: 30px 20px; text-align: center;">
          <p style="color: #333; font-size: 16px;">¡Hola, <strong>${name}</strong>!</p>
          <p style="color: #555; font-size: 15px;">Has sido invitado a formar parte del equipo de administración de la boda.</p>
          <p style="color: #555; font-size: 15px;">Por favor haz clic en el siguiente botón para aceptar tu invitación y activar tu cuenta:</p>
          
          <div style="margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #D4AF37; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
              Aceptar Invitación
            </a>
          </div>

          <p style="color: #888; font-size: 13px;">O copia y pega el siguiente enlace en tu navegador:<br><a href="${inviteLink}" style="color: #D4AF37;">${inviteLink}</a></p>
        </div>
        <div style="text-align: center; border-top: 1px solid #EBE3D5; padding-top: 15px; color: #999; font-size: 12px;">
          © Boda — Sistema de Invitaciones
        </div>
      </div>
    `;
        const info = await transporter.sendMail({
            from: fromAddress,
            to: toEmail,
            subject: `✉️ Invitación para Administrador de Boda — ${name}`,
            html: htmlContent,
        });
        console.log(`✅ [EMAIL SUCCESS] Invitación enviada correctamente a ${toEmail} (ID: ${info.messageId})`);
        return true;
    }
    catch (error) {
        console.error("❌ [EMAIL ERROR] Error enviando correo de invitación:", error);
        return false;
    }
}
