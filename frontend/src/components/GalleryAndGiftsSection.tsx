import { useState } from "react";
import { Box, Text, Title, SimpleGrid, Image, Modal, Stack } from "@mantine/core";

// Fotos Vestimenta 1
import mainDress1 from "../assets/images/pictures/main_dress_1.jpeg";
import pic2Dress1 from "../assets/images/pictures/picture_2_dress_1.jpeg";
import pic3Dress1 from "../assets/images/pictures/picture_3_dress_1.jpeg";

// Fotos Vestimenta 2
import mainDress2 from "../assets/images/pictures/main_dress_2.jpeg";
import pic2Dress2 from "../assets/images/pictures/picture_2_dress_2.jpeg";
import pic3Dress2 from "../assets/images/pictures/picture_3_dress_2.jpeg";

// Iconos y separador
import envelopeRainIcon from "../assets/images/icons/envelope_rain.png";
import separadorImg from "../assets/images/pictures/separador.webp";

export function GalleryAndGiftsSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Box
      style={{
        width: "100%",
        backgroundColor: "#797E5E",
        color: "#F7F4EB",
        padding: "32px 16px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      {/* Título de la Galería */}
      <Text
        style={{
          fontFamily: "var(--font-subtitle)",
          letterSpacing: "3px",
          fontSize: "0.8rem",
          textTransform: "uppercase",
          marginBottom: "4px",
          color: "#F7F4EB",
          opacity: 0.9,
        }}
      >
        NUESTROS MOMENTOS
      </Text>

      <Title
        order={2}
        style={{
          fontFamily: "var(--font-title)",
          fontSize: "3.2rem",
          fontWeight: "normal",
          marginBottom: "24px",
          color: "#F7F4EB",
          lineHeight: 1.1,
        }}
      >
        Galería de Fotos
      </Title>

      {/* BLOQUE VESTIMENTA 1 */}
      <Box style={{ marginBottom: "24px" }}>
        {/* Foto Principal Vestimenta 1 */}
        <Box
          onClick={() => setSelectedImage(mainDress1)}
          style={{
            borderRadius: "14px",
            overflow: "hidden",
            marginBottom: "10px",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Image
            src={mainDress1}
            alt="Vestimenta 1 Principal"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* 2 Fotos Secundarias Vestimenta 1 */}
        <SimpleGrid cols={2} spacing="xs">
          <Box
            onClick={() => setSelectedImage(pic2Dress1)}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
            }}
          >
            <Image
              src={pic2Dress1}
              alt="Vestimenta 1 - 2"
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
          <Box
            onClick={() => setSelectedImage(pic3Dress1)}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
            }}
          >
            <Image
              src={pic3Dress1}
              alt="Vestimenta 1 - 3"
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        </SimpleGrid>
      </Box>

      {/* BLOQUE VESTIMENTA 2 */}
      <Box style={{ marginBottom: "24px" }}>
        {/* Foto Principal Vestimenta 2 */}
        <Box
          onClick={() => setSelectedImage(mainDress2)}
          style={{
            borderRadius: "14px",
            overflow: "hidden",
            marginBottom: "10px",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Image
            src={mainDress2}
            alt="Vestimenta 2 Principal"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* 2 Fotos Secundarias Vestimenta 2 */}
        <SimpleGrid cols={2} spacing="xs">
          <Box
            onClick={() => setSelectedImage(pic2Dress2)}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
            }}
          >
            <Image
              src={pic2Dress2}
              alt="Vestimenta 2 - 2"
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
          <Box
            onClick={() => setSelectedImage(pic3Dress2)}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
            }}
          >
            <Image
              src={pic3Dress2}
              alt="Vestimenta 2 - 3"
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        </SimpleGrid>
      </Box>

      {/* SUBSECCIÓN LLUVIA DE SOBRES */}
      <Stack
        align="center"
        gap={4}
        style={{
          padding: "0px 10px 10px 10px",
        }}
      >
        <img
          src={envelopeRainIcon}
          alt="Lluvia de Sobres"
          style={{
            width: "360px",
            maxWidth: "115%",
            height: "auto",
            marginTop: "-15px",
            marginBottom: "8px",
          }}
        />

        <Title
          order={2}
          style={{
            fontFamily: "var(--font-title)",
            fontSize: "3.0rem",
            fontWeight: "normal",
            color: "#F7F4EB",
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
            color: "#F7F4EB",
            maxWidth: "320px",
            lineHeight: 1.6,
            marginTop: "6px",
          }}
        >
          “Su donativo puede ayudar a que una pareja de recién casados no tenga que dormir en el piso después de la boda, ¡GRACIAS! (Jajaja!)”
        </Text>
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

      {/* Modal para ver fotos ampliadas al tocar */}
      <Modal
        opened={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        centered
        size="auto"
        padding={0}
        withCloseButton={false}
        styles={{
          content: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
          body: {
            padding: 0,
          },
        }}
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Foto ampliada"
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: "16px",
              display: "block",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          />
        )}
      </Modal>
    </Box>
  );
}

export default GalleryAndGiftsSection;
