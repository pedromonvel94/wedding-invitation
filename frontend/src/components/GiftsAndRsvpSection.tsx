import { useState } from "react";
import { Box, Text, Title, Stack, Button, Modal, TextInput, Select } from "@mantine/core";
import api from "../config/axios.ts";

// Imagen verde de lluvia de sobres para contrastar con fondo Beige
import envelopeRainGreenIcon from "../assets/images/icons/envelope_rain_green.png";
import confirmIcon from "../assets/images/icons/confirm_icon.png";
import separadorImg from "../assets/images/pictures/separador.webp";

interface PublicGuest {
  idGuest: number;
  name: string;
  phoneNumber?: string;
  confirmation?: {
    status: "CONFIRMED" | "PENDING" | "DECLINED";
  };
}

interface PublicInvitation {
  idInvitation: number;
  familyName: string;
  guests: PublicGuest[];
}

export function GiftsAndRsvpSection() {
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [invitationData, setInvitationData] = useState<PublicInvitation | null>(null);
  
  // Single guest state
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<string | null>("Sí, asistiré con gusto");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Multi-guest family state: guestId -> "CONFIRMED" | "DECLINED"
  const [familyResponses, setFamilyResponses] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchFamilyDetails = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const invitationId = searchParams.get("invitation");
    if (!invitationId) return;

    try {
      const res = await api.get(`/public/invitations/${invitationId}`);
      if (res.data.success && res.data.data) {
        const inv: PublicInvitation = res.data.data;
        setInvitationData(inv);
        
        // Initial responses map from existing confirmations
        const initialMap: Record<number, string> = {};
        inv.guests.forEach((g) => {
          const status = g.confirmation?.status;
          initialMap[g.idGuest] = status === "DECLINED" ? "Lamentablemente no podré asistir" : "Sí, asistiré con gusto";
        });
        setFamilyResponses(initialMap);
      }
    } catch {
      // Ignorar si no existe
    }
  };

  const handleOpenModal = () => {
    fetchFamilyDetails();
    setRsvpModalOpen(true);
  };

  const handleFamilyResponseChange = (guestId: number, value: string | null) => {
    if (!value) return;
    setFamilyResponses((prev) => ({
      ...prev,
      [guestId]: value,
    }));
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (invitationData && invitationData.guests.length > 0) {
        // Enviar lote para la familia
        const responses = invitationData.guests.map((g) => ({
          guestId: g.idGuest,
          status: familyResponses[g.idGuest] === "Lamentablemente no podré asistir" ? "DECLINED" : "CONFIRMED",
        }));

        await api.post("/public/rsvp/batch", {
          invitationId: invitationData.idInvitation,
          responses,
        });
      } else {
        // Enviar individual
        if (!name.trim()) {
          setLoading(false);
          return;
        }
        const isAttending = attendance === "Sí, asistiré con gusto";
        await api.post("/public/rsvp", {
          name: name.trim(),
          status: isAttending ? "CONFIRMED" : "DECLINED",
          phoneNumber: phoneNumber.trim() || undefined,
        });
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setRsvpModalOpen(false);
    setSubmitted(false);
    setName("");
    setPhoneNumber("");
  };

  return (
    <Box
      style={{
        width: "100%",
        backgroundColor: "#F7F4EB",
        color: "#4A503D",
        padding: "15px 16px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      {/* Separador Superior */}
      <img
        src={separadorImg}
        alt="Separador"
        style={{
          width: "250px",
          height: "auto",
          margin: "0 auto 15px auto",
          display: "block",
        }}
      />

      {/* SECCIÓN LLUVIA DE SOBRES (Fondo Beige) */}
      <Stack align="center" gap={4}>
        <img
          src={envelopeRainGreenIcon}
          alt="Lluvia de Sobres"
          style={{
            width: "280px",
            height: "auto",
            marginBottom: "8px",
          }}
        />

        <Title
          order={2}
          style={{
            fontFamily: "var(--font-title)",
            fontSize: "3.0rem",
            fontWeight: "normal",
            color: "var(--text-dark)",
            lineHeight: 1.1,
          }}
        >
          Lluvia de Sobres
        </Title>

        <Text
          style={{
            fontFamily: "var(--font-subtitle)",
            fontSize: "0.95rem",
            fontStyle: "italic",
            color: "#5C6147",
            maxWidth: "320px",
            lineHeight: 1.6,
            marginTop: "6px",
          }}
        >
          “Su donativo puede ayudar a que una pareja de recién casados no tenga que dormir en el piso después de la boda, ¡GRACIAS! (Jajaja!)”
        </Text>
      </Stack>

      {/* Separador entre Lluvia de Sobres y Confirmación */}
      <img
        src={separadorImg}
        alt="Separador"
        style={{
          width: "220px",
          height: "auto",
          margin: "20px auto 20px auto",
          display: "block",
        }}
      />

      {/* SECCIÓN CONFIRMACIÓN DE ASISTENCIA */}
      <Stack align="center" gap="2px">
        <img
          src={confirmIcon}
          alt="Confirmar asistencia"
          style={{
            width: "80px",
            height: "auto",
            display: "block",
            margin: "0 auto 2px auto",
          }}
        />

        <Title
          order={2}
          style={{
            fontFamily: "var(--font-title)",
            fontSize: "3.2rem",
            fontWeight: "normal",
            color: "var(--text-dark)",
            lineHeight: 1.1,
            marginBottom: "4px",
          }}
        >
          Confirmación
        </Title>

        <Text
          style={{
            fontFamily: "var(--font-subtitle)",
            fontSize: "0.95rem",
            color: "#4A503D",
            maxWidth: "300px",
            lineHeight: 1.5,
            marginBottom: "6px",
          }}
        >
          Agradecemos que confirmes tu asistencia antes del 15 de Octubre
        </Text>

        <Button
          onClick={handleOpenModal}
          className="btn-interactive"
          style={{
            backgroundColor: "#797E5E",
            color: "#F7F4EB",
            borderRadius: "30px",
            padding: "12px 28px",
            height: "auto",
            fontSize: "0.95rem",
            fontFamily: "var(--font-subtitle)",
            fontWeight: 600,
            letterSpacing: "0.5px",
            boxShadow: "0 6px 18px rgba(121, 126, 94, 0.35)",
            transition: "all 0.2s ease-in-out",
          }}
        >
          Confirmar asistencia
        </Button>
      </Stack>

      {/* Separador Inferior */}
      <img
        src={separadorImg}
        alt="Separador"
        style={{
          width: "250px",
          height: "auto",
          margin: "24px auto 0 auto",
          display: "block",
        }}
      />

      {/* Modal de Confirmación de Asistencia */}
      <Modal
        opened={rsvpModalOpen}
        onClose={handleCloseModal}
        title={invitationData ? `Confirmación: ${invitationData.familyName}` : "Confirmación de Asistencia"}
        centered
        radius="lg"
        padding="lg"
        styles={{
          header: {
            backgroundColor: "#F7F4EB",
            borderBottom: "1px solid rgba(121, 126, 94, 0.2)",
          },
          title: {
            fontFamily: "var(--font-title)",
            fontSize: "1.8rem",
            color: "#797E5E",
          },
          content: {
            backgroundColor: "#F7F4EB",
            color: "#4A503D",
          },
        }}
      >
        {submitted ? (
          <Stack align="center" gap="sm" style={{ padding: "16px 0", textAlign: "center" }}>
            <Title order={3} style={{ fontFamily: "var(--font-title)", color: "#797E5E", fontSize: "2.2rem" }}>
              ¡Gracias por confirmar!
            </Title>
            <Text style={{ fontFamily: "var(--font-subtitle)", color: "#4A503D" }}>
              Sus respuestas han sido registradas exitosamente. ¡Esperamos celebrar juntos este día tan especial!
            </Text>
            <Button
              onClick={handleCloseModal}
              style={{
                backgroundColor: "#797E5E",
                color: "#F7F4EB",
                borderRadius: "20px",
                marginTop: "12px",
              }}
            >
              Cerrar
            </Button>
          </Stack>
        ) : (
          <form onSubmit={handleRsvpSubmit}>
            <Stack gap="md">
              {invitationData && invitationData.guests.length > 0 ? (
                // Formulario Multi-Integrante de Familia
                <Stack gap="lg">
                  <Text size="xs" c="dimmed" style={{ fontFamily: "var(--font-subtitle)" }}>
                    Por favor confirma la asistencia individual de cada integrante de la familia:
                  </Text>

                  {invitationData.guests.map((gst) => (
                    <Box key={gst.idGuest} style={{ background: "#FFF", padding: "12px", borderRadius: "10px", border: "1px solid #EAE5D9" }}>
                      <Text fw={700} style={{ color: "#797E5E", fontSize: "1.1rem", fontFamily: "var(--font-subtitle)" }} mb={4}>
                        👤 {gst.name}
                      </Text>
                      <Select
                        label="¿Asistirá a nuestra boda?"
                        data={["Sí, asistiré con gusto", "Lamentablemente no podré asistir"]}
                        value={familyResponses[gst.idGuest] || "Sí, asistiré con gusto"}
                        onChange={(val) => handleFamilyResponseChange(gst.idGuest, val)}
                        styles={{
                          label: { color: "#4A503D", fontFamily: "var(--font-subtitle)", fontSize: "0.85rem" },
                          input: { backgroundColor: "#F7F4EB", borderColor: "#797E5E" },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              ) : (
                // Formulario Individual
                <>
                  <TextInput
                    label="Nombre completo"
                    placeholder="Ingresa tu nombre"
                    required
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    styles={{
                      label: { color: "#4A503D", fontFamily: "var(--font-subtitle)" },
                      input: { backgroundColor: "#FFF", borderColor: "#797E5E" },
                    }}
                  />
                  <Select
                    label="¿Asistirás a nuestra boda?"
                    data={["Sí, asistiré con gusto", "Lamentablemente no podré asistir"]}
                    value={attendance}
                    onChange={setAttendance}
                    styles={{
                      label: { color: "#4A503D", fontFamily: "var(--font-subtitle)" },
                      input: { backgroundColor: "#FFF", borderColor: "#797E5E" },
                    }}
                  />
                  <TextInput
                    label="Teléfono / WhatsApp (Opcional)"
                    placeholder="+57 300 000 0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                    styles={{
                      label: { color: "#4A503D", fontFamily: "var(--font-subtitle)" },
                      input: { backgroundColor: "#FFF", borderColor: "#797E5E" },
                    }}
                  />
                </>
              )}

              <Button
                type="submit"
                loading={loading}
                fullWidth
                style={{
                  backgroundColor: "#797E5E",
                  color: "#F7F4EB",
                  borderRadius: "20px",
                  marginTop: "8px",
                  fontFamily: "var(--font-subtitle)",
                }}
              >
                {invitationData && invitationData.guests.length > 0
                  ? "Enviar Confirmaciones de la Familia"
                  : "Enviar Confirmación"}
              </Button>
            </Stack>
          </form>
        )}
      </Modal>
    </Box>
  );
}

export default GiftsAndRsvpSection;
