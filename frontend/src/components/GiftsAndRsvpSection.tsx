import { useState } from "react";
import { Box, Text, Title, Stack, Button, Modal, TextInput, Select } from "@mantine/core";

// Imagen verde de lluvia de sobres para contrastar con fondo Beige
import envelopeRainGreenIcon from "../assets/images/icons/envelope_rain_green.png";
import confirmIcon from "../assets/images/icons/confirm_icon.png";
import separadorImg from "../assets/images/pictures/separador.webp";

export function GiftsAndRsvpSection() {
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<string | null>("Sí, asistiré con gusto");
  const [submitted, setSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitted(true);
  };

  const handleCloseModal = () => {
    setRsvpModalOpen(false);
    setSubmitted(false);
    setName("");
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
          onClick={() => setRsvpModalOpen(true)}
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
        title="Confirmación de Asistencia"
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
              Tu respuesta ha sido registrada. ¡Esperamos celebrar juntos este día tan especial!
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
              <Button
                type="submit"
                fullWidth
                style={{
                  backgroundColor: "#797E5E",
                  color: "#F7F4EB",
                  borderRadius: "20px",
                  marginTop: "8px",
                  fontFamily: "var(--font-subtitle)",
                }}
              >
                Enviar Confirmación
              </Button>
            </Stack>
          </form>
        )}
      </Modal>
    </Box>
  );
}

export default GiftsAndRsvpSection;
