import { Box, Text, Title, SimpleGrid, Stack } from "@mantine/core";
import dressCodeIcon from "../assets/images/icons/Dress Code.png";

export function DressCodeSection() {
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
      {/* Etiqueta Superior */}
      <Text
        style={{
          fontFamily: "var(--font-subtitle)",
          letterSpacing: "3px",
          fontSize: "0.8rem",
          textTransform: "uppercase",
          marginBottom: "6px",
          color: "#F7F4EB",
          opacity: 0.9,
        }}
      >
        CÓDIGO DE VESTIMENTA
      </Text>

      {/* Icono de Dress Code */}
      <img
        src={dressCodeIcon}
        alt="Dress Code"
        style={{
          width: "90px",
          height: "auto",
          margin: "8px auto 4px auto",
          display: "block",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
        }}
      />

      {/* Título Principal Centrado */}
      <Title
        order={2}
        style={{
          fontFamily: "var(--font-title)",
          fontSize: "3.2rem",
          fontWeight: "normal",
          color: "#F7F4EB",
          marginBottom: "8px",
          lineHeight: 1.1,
        }}
      >
        Formal
      </Title>

      {/* 2 Columnas: Ellos / Ellas */}
      <SimpleGrid cols={2} spacing="md" style={{ textAlign: "center" }}>
        {/* Columna Ellos */}
        <Box
          style={{
            backgroundColor: "rgba(247, 244, 235, 0.12)",
            borderRadius: "16px",
            padding: "20px 12px",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(247, 244, 235, 0.2)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
          }}
        >
          <Title
            order={3}
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "2.0rem",
              fontWeight: "normal",
              color: "#F7F4EB",
              marginBottom: "6px",
            }}
          >
            Ellos
          </Title>
          <Stack gap={8} style={{ alignItems: "center" }}>
            <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.75rem", color: "#F7F4EB", lineHeight: 1.4 }}>
              • Blazer o saco sport
            </Text>
            <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.75rem", color: "#F7F4EB", lineHeight: 1.4 }}>
              • Camisa (Con o sin corbata)
            </Text>
            <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.75rem", color: "#F7F4EB", lineHeight: 1.4 }}>
              • Pantalón de vestir
            </Text>
            <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.75rem", color: "#F7F4EB", lineHeight: 1.4 }}>
              • Zapatos Clásicos
            </Text>
          </Stack>
        </Box>

        {/* Columna Ellas */}
        <Box
          style={{
            backgroundColor: "rgba(247, 244, 235, 0.12)",
            borderRadius: "16px",
            padding: "20px 12px",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(247, 244, 235, 0.2)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
          }}
        >
          <Title
            order={3}
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "2.0rem",
              fontWeight: "normal",
              color: "#F7F4EB",
              marginBottom: "6px",
            }}
          >
            Ellas
          </Title>
          <Stack gap={8} style={{ alignItems: "center" }}>
            <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.75rem", color: "#F7F4EB", lineHeight: 1.4 }}>
              • Vestido Largo, Midi o corto elegante
            </Text>
            <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.75rem", color: "#F7F4EB", lineHeight: 1.4 }}>
              • Conjunto (Falda o pantalón)
            </Text>
            <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.75rem", color: "#F7F4EB", lineHeight: 1.4 }}>
              • Tacones o zapatos elegantes
            </Text>
          </Stack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export default DressCodeSection;
