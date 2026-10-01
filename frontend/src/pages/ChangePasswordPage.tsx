import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  PasswordInput,
  Paper,
  Alert,
  Badge,
  List,
  ThemeIcon,
} from "@mantine/core";
import { IconShieldLock, IconCheck } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../config/axios.ts";
import { useAuth } from "../context/AuthContext.tsx";

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // El email viene desde el state del navigate al detectar mustChangePassword
  const emailFromState = (location.state as { email?: string })?.email || "";

  const [email] = useState(emailFromState);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Si ya está autenticado, redirigir al panel
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
      return;
    }
    // Si no hay email en el state, redirigir al login
    if (!emailFromState) {
      navigate("/admin/login", { replace: true });
    }
  }, [isAuthenticated, emailFromState, navigate]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword === oldPassword) {
      setErrorMsg("La nueva contraseña debe ser diferente a la contraseña actual.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/change-password", {
        email,
        oldPassword,
        newPassword,
        confirmPassword,
      });

      const data = response.data;

      if (data.success && data.token) {
        login(data.token, data.admin);
        navigate("/admin", { replace: true });
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setErrorMsg(
        axiosErr.response?.data?.message ||
          "Error al cambiar la contraseña. Verifica que la contraseña anterior sea correcta.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" py={60}>
      <Paper
        radius="lg"
        p={30}
        withBorder
        style={{
          backgroundColor: "#F7F4EB",
          borderColor: "#E6DFC8",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Stack gap="md">
          {/* Cabecera */}
          <Stack gap={4} align="center" style={{ textAlign: "center" }}>
            <Badge color="orange" variant="light" size="lg" leftSection={<IconShieldLock size={14} />}>
              Primer Inicio de Sesión
            </Badge>
            <Title
              order={2}
              style={{
                fontFamily: "var(--font-subtitle)",
                color: "#2B2826",
                fontSize: "1.8rem",
              }}
            >
              Crea tu Contraseña
            </Title>
            <Text size="sm" c="dimmed" style={{ maxWidth: "340px" }}>
              Por seguridad, debes crear tu propia contraseña antes de acceder al panel.
              {email && (
                <Text component="span" fw={600} c="dark"> ({email})</Text>
              )}
            </Text>
          </Stack>

          {/* Instrucciones */}
          <Paper p="sm" radius="md" style={{ backgroundColor: "#EBE3D5" }}>
            <Text size="xs" fw={600} c="dark" mb={4}>Requisitos de contraseña:</Text>
            <List size="xs" c="dark" spacing={2}>
              <List.Item icon={<ThemeIcon color="teal" size={14} radius="xl"><IconCheck size={10} /></ThemeIcon>}>
                Mínimo 6 caracteres
              </List.Item>
              <List.Item icon={<ThemeIcon color="teal" size={14} radius="xl"><IconCheck size={10} /></ThemeIcon>}>
                Diferente a la contraseña temporal
              </List.Item>
            </List>
          </Paper>

          {/* Error */}
          {errorMsg && (
            <Alert color="red" radius="md" title="Error" withCloseButton onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          )}

          {/* Formulario */}
          <form onSubmit={handleChangePassword}>
            <Stack gap="md">
              <PasswordInput
                id="change-old-password"
                label="Contraseña Actual (Temporal)"
                placeholder="La contraseña que te asignaron"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.currentTarget.value)}
                styles={{
                  label: { color: "#4A503D", fontFamily: "var(--font-subtitle)", fontWeight: 600 },
                  input: { borderColor: "#797E5E" },
                }}
              />

              <PasswordInput
                id="change-new-password"
                label="Nueva Contraseña"
                placeholder="Mínimo 6 caracteres"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.currentTarget.value)}
                styles={{
                  label: { color: "#4A503D", fontFamily: "var(--font-subtitle)", fontWeight: 600 },
                  input: {
                    borderColor: newPassword && confirmPassword && newPassword !== confirmPassword
                      ? "#e03131"
                      : "#797E5E",
                  },
                }}
              />

              <PasswordInput
                id="change-confirm-password"
                label="Confirmar Nueva Contraseña"
                placeholder="Repite tu nueva contraseña"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                error={
                  confirmPassword && newPassword !== confirmPassword
                    ? "Las contraseñas no coinciden"
                    : null
                }
                styles={{
                  label: { color: "#4A503D", fontFamily: "var(--font-subtitle)", fontWeight: 600 },
                  input: { borderColor: "#797E5E" },
                }}
              />

              <Button
                id="change-password-submit"
                type="submit"
                loading={loading}
                fullWidth
                radius="xl"
                size="md"
                disabled={!oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                style={{
                  backgroundColor: "#797E5E",
                  color: "#F7F4EB",
                  fontFamily: "var(--font-subtitle)",
                  fontWeight: 600,
                }}
              >
                Guardar Contraseña e Ingresar
              </Button>
            </Stack>
          </form>

          <Button
            variant="subtle"
            color="gray"
            size="xs"
            onClick={() => navigate("/admin/login")}
            style={{ marginTop: "4px" }}
          >
            ← Volver al Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default ChangePasswordPage;
