import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Loader,
  Alert,
} from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { api } from "../config/axios";

export function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        setMessage("Token de invitación no proporcionado.");
        return;
      }

      try {
        const response = await api.get(`/admins/accept-invite/${token}`);
        if (response.data.success) {
          setSuccess(true);
          setMessage(response.data.message || "¡Invitación aceptada exitosamente!");
        } else {
          setSuccess(false);
          setMessage(response.data.message || "El enlace de invitación no es válido o ha expirado.");
        }
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setSuccess(false);
        setMessage(errorObj.response?.data?.message || "Token de invitación inválido o expirado.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Container size={460} my={80}>
      <Paper radius="md" p="xl" withBorder style={{ backgroundColor: "#FFF" }}>
        <Stack align="center" gap="md">
          <Title order={2} style={{ fontFamily: "serif", color: "#4A3F35", textAlign: "center" }}>
            💍 Invitación a Boda Admin
          </Title>

          {loading && (
            <Stack align="center" py="xl">
              <Loader color="amber" size="lg" />
              <Text size="sm" c="dimmed">
                Verificando token de invitación...
              </Text>
            </Stack>
          )}

          {!loading && success && (
            <Stack align="center" gap="sm">
              <Alert icon={<IconCheck size={20} />} title="¡Bienvenido!" color="teal">
                {message}
              </Alert>
              <Text size="sm" c="dimmed" ta="center">
                Tu cuenta de administrador ha sido confirmada y activada. Ya puedes iniciar sesión con tu correo electrónico.
              </Text>
              <Button
                color="amber"
                fullWidth
                mt="md"
                onClick={() => navigate("/admin/login")}
              >
                Ir a Iniciar Sesión
              </Button>
            </Stack>
          )}

          {!loading && !success && (
            <Stack align="center" gap="sm">
              <Alert icon={<IconAlertCircle size={20} />} title="Error de Invitación" color="red">
                {message}
              </Alert>
              <Button
                variant="outline"
                color="gray"
                fullWidth
                mt="md"
                onClick={() => navigate("/admin/login")}
              >
                Volver al Login
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

export default AcceptInvitePage;
