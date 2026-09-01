import { useState } from "react";
import { Box, Text, Title, Stack } from "@mantine/core";

// Importación de las 6 capas PNG oficiales de 1080x2340
import envelopeBody from "../assets/images/envelope_body.png";
import envelopeBodyInside from "../assets/images/envelope_body_inside.png";
import envelopeFlap from "../assets/images/envelope_flap.png";
import envelopeFlapInside from "../assets/images/envelope_flap_inside.png";
import goldenSeal from "../assets/images/golden_seal.png";
import goldenSealBack from "../assets/images/golden_seal_back.png";

import eucaliptoImg from "../assets/images/pictures/eucalipto.webp";
import separadorImg from "../assets/images/pictures/separador.webp";

// Sección 2: Foto Principal
import HeroPhotoSection from "./HeroPhotoSection.tsx";

// Sección 4: Calendario Verde Olivo
import CalendarSection from "./CalendarSection.tsx";

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
          <Stack align="center" gap="xs" style={{ textAlign: "center", width: "100%" }}>
            <Box style={{ padding: "140px 24px 0 24px" }}>
              <img
                src={eucaliptoImg}
                alt="Rama de eucalipto"
                style={{
                  position: "absolute",
                  top: "-29px",
                  left: "-21px",
                  width: "100%",
                  height: "auto",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              {/* Frase poética en la cabecera superior */}
              <Text
                style={{
                  fontFamily: "var(--font-subtitle)",
                  fontStyle: "italic",
                  color: "var(--text-olive)",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  margin: "16px",
                }}
              >
                “Y entre millones de caminos en el mundo, nuestros pasos eligieron encontrarse para siempre.”
              </Text>

              {/* Nombres principales */}
              <Title order={1} style={{ fontFamily: "var(--font-title)", color: "var(--text-dark)", fontSize: "3.9rem", fontWeight: "normal", lineHeight: 1.1 }}>
                Juan Pedro & Catalina
              </Title>

              {/* Subtítulo NUESTRA BODA */}
              <Text size="xs" style={{ fontFamily: "var(--font-subtitle)", color: "var(--green-accent)", letterSpacing: "3px", marginBottom: "7px", marginTop: "14px" }}>
                NUESTRA BODA
              </Text>

              {/* Separador entre Título y Foto Principal */}
              <img
                src={separadorImg}
                alt="Separador"
                style={{
                  width: "250px",
                  height: "auto",
                  margin: "14px auto 0 auto",
                  display: "block",
                }}
              />
            </Box>

            {/* Foto Principal de los Novios de lado a lado */}
            <HeroPhotoSection />

            {/* Paso 27: Sección Verde Olivo (Frase de invitación, Fecha enmarcada, Timer en vivo y Calendario con corazón) */}
            <CalendarSection />
          </Stack>
        </Box>

      </Box>
    </Box>
  );
}

export default EnvelopeSection;
