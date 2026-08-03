import { Container, Title, Text, Stack } from "@mantine/core";

export function LandingPage() {
  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="md" style={{ textAlign: "center" }}>
        <Text
          size="xl"
          style={{
            fontFamily: "Prata, serif",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#797E5E",
            fontSize: "1.2rem",
          }}
        >
          Nuestra Boda
        </Text>

        <Title
          order={1}
          style={{
            fontFamily: "'Nova Quinta', cursive",
            color: "#2B2826",
            fontSize: "4.5rem",
            fontWeight: "normal",
            lineHeight: 1.1,
          }}
        >
          Pedro & Catalina
        </Title>

        <Text
          size="lg"
          style={{
            fontFamily: "Arvo, serif",
            color: "#4D513B",
            marginTop: "1rem",
          }}
        >
          ¡Bienvenidos a nuestra invitación digital!
        </Text>
      </Stack>
    </Container>
  );
}

export default LandingPage;
