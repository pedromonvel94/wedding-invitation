import { Box, Image, Text } from "@mantine/core";
import mainPicture from "../assets/images/pictures/main_picture.webp";

export function HeroPhotoSection() {
  return (
    <Box style={{ width: "100%" }}>
      {/* Fotografía de lado a lado */}
      <Box
        style={{
          width: "100%",
          marginTop: "16px",
          overflow: "hidden",
        }}
      >
        <Image
          src={mainPicture}
          alt="Pedro & Catalina"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Sub paso 2: Frase Emotiva debajo de la foto */}
      <Box style={{ padding: "20px 24px 24px 24px", textAlign: "center" }}>
        <Text
          style={{
            fontFamily: "var(--font-subtitle)",
            fontStyle: "italic",
            color: "var(--text-olive)",
            fontSize: "1.0rem",
            lineHeight: 1.6,
          }}
        >
          “Y entre millones de caminos en el mundo, nuestros pasos eligieron encontrarse para siempre.”
        </Text>
      </Box>
    </Box>
  );
}

export default HeroPhotoSection;
