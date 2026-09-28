import { useState } from "react";
import { Box, Text, Title, SimpleGrid, Image, Modal } from "@mantine/core";

// Fotos Vestimenta 1
import mainDress1 from "../assets/images/pictures/main_dress_1.jpeg";
import pic2Dress1 from "../assets/images/pictures/picture_2_dress_1.jpeg";
import pic3Dress1 from "../assets/images/pictures/picture_3_dress_1.jpeg";

// Fotos Vestimenta 2
import mainDress2 from "../assets/images/pictures/main_dress_2.jpeg";
import pic2Dress2 from "../assets/images/pictures/picture_2_dress_2.jpeg";
import pic3Dress2 from "../assets/images/pictures/picture_3_dress_2.jpeg";

// Separador
import separadorImg from "../assets/images/pictures/separador.webp";

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Box
      style={{
        width: "100%",
        backgroundColor: "#F7F4EB",
        color: "#4A503D",
        padding: "12px 16px 20px 16px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      {/* Separador Superior al iniciar la sección Beige de Galería */}
      <img
        src={separadorImg}
        alt="Separador"
        style={{
          width: "250px",
          height: "auto",
          margin: "0 auto 20px auto",
          display: "block",
        }}
      />

      {/* SECCIÓN GALERÍA DE FOTOS DE NUESTROS MOMENTOS */}
      <Text
        style={{
          fontFamily: "var(--font-subtitle)",
          letterSpacing: "3px",
          fontSize: "0.8rem",
          textTransform: "uppercase",
          marginBottom: "4px",
          color: "var(--text-dark)",
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
          color: "var(--text-dark)",
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
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
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
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
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
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
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
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
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
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
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
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
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

export default GallerySection;
