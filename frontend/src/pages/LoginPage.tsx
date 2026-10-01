import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  TextInput,
  PasswordInput,
  Paper,
  Alert,
  Badge,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import api from "../config/axios.ts";
import { useAuth } from "../context/AuthContext.tsx";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const data = response.data;

      if (data.success && data.mustChangePassword) {
        // Primer login — redirigir a cambio de contraseña
        navigate("/admin/change-password", {
          state: { email: data.email },
        });
        return;
      }

      if (data.success && data.token) {
        login(data.token, data.admin);
        navigate("/admin");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setErrorMsg(
        axiosErr.response?.data?.message ||
          "Correo o contraseña incorrectos. Verifica tus credenciales.",
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
            <Badge color="green" variant="light" size="lg">
              Panel Administrativo Privado
            </Badge>
            <Title
              order={2}
              style={{
                fontFamily: "var(--font-subtitle)",
                color: "#2B2826",
                fontSize: "1.8rem",
              }}
            >
              Iniciar Sesión
            </Title>
            <Text size="sm" c="dimmed" style={{ maxWidth: "300px" }}>
              Ingresa tu correo y contraseña para acceder al panel de administración
            </Text>
          </Stack>

          {/* Error */}
          {errorMsg && (
            <Alert color="red" radius="md" title="Error de autenticación" withCloseButton onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          )}

          {/* Formulario */}
          <form onSubmit={handleLogin}>
            <Stack gap="md">
              <TextInput
                id="login-email"
                label="Correo Electrónico"
                placeholder="admin@ejemplo.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                styles={{
                  label: { color: "#4A503D", fontFamily: "var(--font-subtitle)", fontWeight: 600 },
                  input: { borderColor: "#797E5E" },
                }}
              />

              <PasswordInput
                id="login-password"
                label="Contraseña"
                placeholder="Tu contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                styles={{
                  label: { color: "#4A503D", fontFamily: "var(--font-subtitle)", fontWeight: 600 },
                  input: { borderColor: "#797E5E" },
                }}
              />

              <Button
                id="login-submit"
                type="submit"
                loading={loading}
                fullWidth
                radius="xl"
                size="md"
                style={{
                  backgroundColor: "#797E5E",
                  color: "#F7F4EB",
                  fontFamily: "var(--font-subtitle)",
                  fontWeight: 600,
                }}
              >
                Ingresar
              </Button>
            </Stack>
          </form>

          <Button
            variant="subtle"
            color="gray"
            size="xs"
            onClick={() => navigate("/")}
            style={{ marginTop: "10px" }}
          >
            ← Volver a la Invitación Pública
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default LoginPage;
