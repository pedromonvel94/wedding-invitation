import axios from "axios";

/**
 * Enviar mensaje usando la API Oficial de Meta WhatsApp Cloud API
 */
export async function sendWhatsAppMessage(
  toPhoneNumber: string,
  templateName: string,
  parameters: string[],
): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  // Formatear número celular a formato internacional (ej: +573205832210 -> 573205832210)
  let cleanPhone = toPhoneNumber.replace(/\D/g, "");
  if (!cleanPhone.startsWith("57") && cleanPhone.length === 10) {
    cleanPhone = `57${cleanPhone}`;
  }

  if (!token || !phoneNumberId) {
    console.log(`📱 [WHATSAPP NOTIFICACIÓN] Para enviar WhatsApp automáticos reales en segundo plano desde la API Oficial de Meta, configura WHATSAPP_TOKEN y WHATSAPP_PHONE_NUMBER_ID en el backend.`);
    console.log(`📱 [WHATSAPP DESTINATARIO]: +${cleanPhone} | Plantilla: ${templateName} | Parámetros: ${parameters.join(", ")}`);
    return false;
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    const data = {
      messaging_product: "whatsapp",
      to: cleanPhone,
      type: "template",
      template: {
        name: templateName,
        language: { code: "es" },
        components: [
          {
            type: "body",
            parameters: parameters.map((text) => ({
              type: "text",
              text,
            })),
          },
        ],
      },
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ [WHATSAPP SUCCESS] Mensaje de WhatsApp enviado a +${cleanPhone} (ID: ${response.data.messages?.[0]?.id})`);
    return true;
  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: unknown }; message?: string };
    console.error("❌ [WHATSAPP ERROR] Error enviando mensaje por la API Oficial de Meta WhatsApp:", errorObj.response?.data || errorObj.message);
    return false;
  }
}

/**
 * Enviar código de verificación de inicio de sesión por WhatsApp
 */
export async function sendOtpWhatsApp(phoneNumber: string, otpCode: string): Promise<boolean> {
  return sendWhatsAppMessage(phoneNumber, "codigo_verificacion_boda", [otpCode]);
}

/**
 * Enviar invitación de matrimonio por WhatsApp a una familia
 */
export async function sendInvitationWhatsApp(
  phoneNumber: string,
  familyName: string,
  invitationUrl: string,
): Promise<boolean> {
  return sendWhatsAppMessage(phoneNumber, "invitacion_boda", [familyName, invitationUrl]);
}
