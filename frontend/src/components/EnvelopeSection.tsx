import { useState } from "react";
import { Box, Text, Title, Stack } from "@mantine/core";

// Importación de las 6 capas PNG oficiales de 1080x2340
import envelopeBody from "../assets/images/envelope_body.png";
import envelopeBodyInside from "../assets/images/envelope_body_inside.png";
import envelopeFlap from "../assets/images/envelope_flap.png";
import envelopeFlapInside from "../assets/images/envelope_flap_inside.png";
import goldenSeal from "../assets/images/golden_seal.png";
import goldenSealBack from "../assets/images/golden_seal_back.png";

import "./EnvelopeSection.css";

export function EnvelopeSection() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
  };

  return (
    <Box className="envelope-container">
      <Box className={`envelope-wrapper ${isOpen ? "open" : ""}`}>

        {/* GRUPO SOBRE COMPLETO: 6 capas de 1080x2340 solapadas con 100% de precisión */}
        <Box className="envelope-box">

          {/* Capa 1: Fondo Interno del Sobre */}
          <img
            src={envelopeBodyInside}
            alt="Interior del sobre"
            className="envelope-layer layer-body-inside"
          />

          {/* Capa 3: Cuerpo Verde Olivo (Frente con Fecha 13/12/2026) */}
          <img
            src={envelopeBody}
            alt="Cuerpo del sobre"
            className="envelope-layer layer-body"
          />

          {/* Capa 4-A: Solapa Cerrada con Monograma (Pedro & Catalina) */}
          <img
            src={envelopeFlap}
            alt="Solapa cerrada"
            className="envelope-layer layer-flap-closed"
          />

          {/* Capa 4-B: Solapa Abierta apuntando hacia arriba */}
          <img
            src={envelopeFlapInside}
            alt="Solapa abierta"
            className="envelope-layer layer-flap-open"
          />

          {/* Capa 5-A: Sello Dorado Frontal */}
          <img
            src={goldenSeal}
            alt="Sello Dorado de Cera"
            className="envelope-layer layer-seal-front"
            onClick={handleOpenEnvelope}
          />

          {/* Capa 5-B: Sello Dorado Trasero */}
          <img
            src={goldenSealBack}
            alt="Sello Dorado Trasero"
            className="envelope-layer layer-seal-back"
          />

          {/* Zona interactiva exacta sobre el Sello Dorado */}
          <Box
            className="seal-click-area"
            onClick={handleOpenEnvelope}
          />

        </Box>

        {/* LA CARTA / INVITACIÓN DE LA BODA (Pedro & Catalina) */}
        <Box className="envelope-inside-card">
          <Stack align="center" gap="md" style={{ textAlign: "center" }}>
            <Text size="xs" style={{ fontFamily: "Prata, serif", color: "#797E5E", letterSpacing: "3px" }}>
              NUESTRA BODA
            </Text>
            <Title order={1} style={{ fontFamily: "'Nova Quinta', cursive", color: "#2B2826", fontSize: "3.2rem", fontWeight: "normal", lineHeight: 1.1 }}>
              Pedro & Catalina
            </Title>
            <Text size="xs" style={{ fontFamily: "Arvo, serif", color: "#4D513B", marginTop: "4px" }}>
              13 de Diciembre, 2026
            </Text>
            <Text size="xs" c="dimmed" style={{ fontFamily: "Arvo, serif", marginTop: "0.8rem" }}>
              ¡Bienvenidos a nuestra invitación digital!
            </Text>
          </Stack>
        </Box>

      </Box>
    </Box>
  );
}

export default EnvelopeSection;
