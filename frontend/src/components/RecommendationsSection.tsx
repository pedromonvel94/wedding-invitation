import { Box, Text, Title, Stack } from "@mantine/core";

export function RecommendationsSection() {
  return (
    <Box
      style={{
        width: "100%",
        backgroundColor: "#797E5E",
        color: "#F7F4EB",
        padding: "36px 16px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      {/* SECCIÓN RECOMENDACIONES (VERDE OLIVO) */}
      <Stack align="center" gap="xs">
        <Text
          style={{
            fontFamily: "var(--font-subtitle)",
            letterSpacing: "3px",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            color: "#F7F4EB",
            fontWeight: 600,
            marginBottom: "6px",
          }}
        >
          RECOMENDACIONES
        </Text>

        {/* Puntos de Recomendaciones en texto limpio */}
        <Stack gap={4} style={{ textAlign: "center", alignItems: "center", maxWidth: "320px" }}>
          <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.85rem", color: "#F7F4EB", lineHeight: 1.4 }}>
            Seguir las indicaciones del personal de la boda.
          </Text>
          <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.85rem", color: "#F7F4EB", lineHeight: 1.4 }}>
            Ser súper puntuales.
          </Text>
          <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.85rem", color: "#F7F4EB", lineHeight: 1.4 }}>
            ¡Divertirse mucho!
          </Text>
        </Stack>

        {/* Mensaje de Cierre */}
        <Box style={{ marginTop: "24px", textAlign: "center" }}>
          <Text
            style={{
              fontFamily: "var(--font-subtitle)",
              letterSpacing: "2.5px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              color: "#F7F4EB",
            }}
          >
            ESPERAMOS CONTAR CON SU PRESENCIA
          </Text>
          <Title
            order={3}
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "2.4rem",
              fontWeight: "normal",
              color: "#F7F4EB",
              marginTop: "4px",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            ¡Muchas Gracias!
          </Title>
        </Box>
      </Stack>
    </Box>
  );
}

export default RecommendationsSection;
