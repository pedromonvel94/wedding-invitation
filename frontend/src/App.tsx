import { Button, Container, Title, Stack } from "@mantine/core";

function App() {
  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="md">
        <Title order={1} style={{ color: "#4A3F35" }}>
          Prueba Mantine UI Invitación de Boda
        </Title>
        <Button size="lg" radius="md">
          Confirmar Asistencia (Mantine Button)
        </Button>
      </Stack>
    </Container>
  );
}

export default App;

