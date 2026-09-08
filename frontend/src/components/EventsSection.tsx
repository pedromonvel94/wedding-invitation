import { Box, Text, Title, Button, Stack } from "@mantine/core";

// Importación de iconos y gráficos
import separadorImg from "../assets/images/pictures/separador.webp";
import iglesiaIcon from "../assets/images/icons/iglesia.png";
import iglesiaMapPoint from "../assets/images/icons/iglesia_map_point.png";
import fiestaIcon from "../assets/images/icons/fiesta.png";
import recepcionMapPoint from "../assets/images/icons/recepcion_map_point.png";

export function EventsSection() {
  const mapIglesiaUrl = "https://maps.google.com/?q=Parroquia+Padre+Marianito+Carrera+24B+17-110+Medellin";
  const mapRecepcionUrl = "https://maps.google.com/?q=Restaurante+Al+Patio+Carrera+38+19-265+Medellin";

  return (
    <Box
      style={{
        width: "100%",
        backgroundColor: "var(--bg-cream)",
        padding: "10px 20px",
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

      {/* BLOQUE 1: CEREMONIA MATRIMONIAL */}
      <Stack
        align="center"
        gap={5}
        style={{
          marginBottom: "28px",
        }}
      >
        <img
          src={iglesiaIcon}
          alt="Iglesia"
          style={{
            width: "85px",
            height: "auto",
            marginBottom: "4px",
          }}
        />

        <Title
          order={2}
          style={{
            fontFamily: "var(--font-title)",
            color: "var(--text-dark)",
            fontSize: "2.5rem",
            fontWeight: "normal",
            lineHeight: 1.1,
          }}
        >
          Ceremonia Matrimonial
        </Title>

        <Text
          style={{
            fontFamily: "var(--font-subtitle)",
            color: "var(--green-accent)",
            fontSize: "1.2rem",
            fontWeight: "bold",
            letterSpacing: "1px",
            lineHeight: 1.2,
            marginTop: "2px",
          }}
        >
          02:00 P.M.
        </Text>

        <Text
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-dark)",
            fontSize: "1.05rem",
            fontWeight: "bold",
            lineHeight: 1.2,
            marginTop: "2px",
          }}
        >
          Parroquia Padre Marianito
        </Text>

        <Text
          style={{
            fontFamily: "var(--font-subtitle)",
            color: "var(--text-olive)",
            fontSize: "0.85rem",
            fontStyle: "italic",
            lineHeight: 1.2,
          }}
        >
          (Beato Mariano de Jesús Euse Hoyos)
        </Text>

        <Text
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-olive)",
            fontSize: "0.9rem",
            maxWidth: "290px",
            lineHeight: 1.3,
            marginTop: "2px",
          }}
        >
          Carrera 24B # 17-110, Medellín, Antioquia
        </Text>

        {/* Botón Ver Ubicación Iglesia */}
        <Button
          component="a"
          href={mapIglesiaUrl}
          target="_blank"
          rel="noopener noreferrer"
          radius="xl"
          size="md"
          style={{
            backgroundColor: "var(--green-accent)",
            color: "#F7F4EB",
            fontFamily: "var(--font-subtitle)",
            letterSpacing: "1.5px",
            fontSize: "0.85rem",
            marginTop: "10px",
            padding: "0 24px",
            boxShadow: "0 4px 14px rgba(121, 126, 94, 0.35)",
          }}
          leftSection={
            <img
              src={iglesiaMapPoint}
              alt="Pin Iglesia"
              style={{
                width: "35px",
                height: "30px",
                filter: "brightness(0) invert(1)",
              }}
            />
          }
        >
          VER UBICACIÓN
        </Button>
      </Stack>

      {/* BLOQUE 2: RECEPCIÓN */}
      <Stack
        align="center"
        gap={3}
        style={{
          marginBottom: "28px",
        }}
      >
        <img
          src={fiestaIcon}
          alt="Fiesta / Recepción"
          style={{
            width: "85px",
            height: "auto",
            marginBottom: "4px",
          }}
        />

        <Title
          order={2}
          style={{
            fontFamily: "var(--font-title)",
            color: "var(--text-dark)",
            fontSize: "2.5rem",
            fontWeight: "normal",
            lineHeight: 1.1,
          }}
        >
          Recepción
        </Title>

        <Text
          style={{
            fontFamily: "var(--font-subtitle)",
            color: "var(--green-accent)",
            fontSize: "1.2rem",
            fontWeight: "bold",
            letterSpacing: "1px",
            lineHeight: 1.2,
            marginTop: "2px",
          }}
        >
          04:00 P.M.
        </Text>

        <Text
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-dark)",
            fontSize: "1.05rem",
            fontWeight: "bold",
            lineHeight: 1.2,
            marginTop: "2px",
          }}
        >
          Restaurante Al Patio
        </Text>

        <Text
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-olive)",
            fontSize: "0.9rem",
            maxWidth: "290px",
            lineHeight: 1.3,
            marginTop: "2px",
          }}
        >
          Carrera 38 No.19 -265 Km 2 Vía las Palmas, Medellín, Antioquia
        </Text>

        {/* Botón Ver Ubicación Recepción */}
        <Button
          component="a"
          href={mapRecepcionUrl}
          target="_blank"
          rel="noopener noreferrer"
          radius="xl"
          size="md"
          style={{
            backgroundColor: "var(--green-accent)",
            color: "#F7F4EB",
            fontFamily: "var(--font-subtitle)",
            letterSpacing: "1.5px",
            fontSize: "0.85rem",
            marginTop: "10px",
            padding: "0 24px",
            boxShadow: "0 4px 14px rgba(121, 126, 94, 0.35)",
          }}
          leftSection={
            <img
              src={recepcionMapPoint}
              alt="Pin Recepción"
              style={{
                width: "35px",
                height: "30px",
                filter: "brightness(0) invert(1)",
              }}
            />
          }
        >
          VER UBICACIÓN
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
    </Box>
  );
}

export default EventsSection;
