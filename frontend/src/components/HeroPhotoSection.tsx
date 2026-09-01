import { Box, Image } from "@mantine/core";
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
    </Box>
  );
}

export default HeroPhotoSection;
