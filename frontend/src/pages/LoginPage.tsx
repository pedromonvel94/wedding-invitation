import { Container, Title, Button, Stack, TextInput, PasswordInput, Paper } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Stack gap="md">
          <Title order={2} ta="center" style={{ color: "#4A3F35" }}>
            Iniciar Sesión — Admin
          </Title>
          <TextInput label="Correo Electrónico" placeholder="admin@wedding.com" required />
          <PasswordInput label="Contraseña" placeholder="••••••••" required />
          <Button fullWidth onClick={() => navigate("/admin")}>
            Ingresar al Dashboard
          </Button>
          <Button variant="subtle" fullWidth onClick={() => navigate("/")}>
            Volver a la Invitación
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default LoginPage;
