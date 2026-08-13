import { Container, Title, Text, Button, Stack, Group, Paper } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2} style={{ color: "#4A3F35" }}>
            Panel Administrativo — Dashboard
          </Title>
          <Button variant="outline" color="red" onClick={() => navigate("/admin/login")}>
            Cerrar Sesión
          </Button>
        </Group>

        <Paper p="md" withBorder radius="md">
          <Text size="lg" fw={500}>
            Resumen General de Invitaciones
          </Text>
          <Text c="dimmed" mt="xs">
            Aquí podrás gestionar la lista de invitados, invitaciones familiares y confirmaciones de asistencia.
          </Text>
        </Paper>

        <Button variant="subtle" onClick={() => navigate("/")}>
          ← Ver Landing Page de Invitación
        </Button>
      </Stack>
    </Container>
  );
}

export default DashboardPage;
