import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  TextInput,
  Paper,
  PinInput,
  Alert,
  Group,
  Box,
  Badge,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import api from "../config/axios.ts";
import { useAuth } from "../context/AuthContext.tsx";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Si el usuario ya está autenticado, redirigir automáticamente al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Paso del formulario: 1 = Ingresar Email, 2 = Ingresar PIN de 6 dígitos
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Paso 1: Solicitud de código por correo
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login-request", {
        email: email.trim(),
      });

      if (response.data.success) {
        setSuccessInfo(response.data.message);
        setStep(2);
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setErrorMsg(
          axiosErr.response?.data?.message ||
            "El correo no está registrado como administrador autorizado.",
        );
      } else {
        setErrorMsg("Error de conexión con el servidor de autenticación.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificación del código de 6 dígitos
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpCode.length !== 6) {
      setErrorMsg("Debes ingresar el código completo de 6 dígitos numéricos.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login-verify", {
        email: email.trim(),
        otpCode: otpCode.trim(),
      });

      if (response.data.success && response.data.token) {
        login(response.data.token, response.data.admin);
        navigate("/admin");
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setErrorMsg(
          axiosErr.response?.data?.message ||
            "El código de 6 dígitos es incorrecto o ha expirado.",
        );
      } else {
        setErrorMsg("Error al verificar el código de seguridad.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setOtpCode("");
    setErrorMsg(null);
    setSuccessInfo(null);
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
              {step === 1 ? "Iniciar Sesión" : "Verificación de Seguridad"}
            </Title>
            <Text size="sm" c="dimmed" style={{ maxWidth: "300px" }}>
              {step === 1
                ? "Ingresa tu correo autorizado para recibir el código de verificación de 6 dígitos por Correo"
                : `Ingresa el código numérico de 6 dígitos enviado a ${email}`}
            </Text>
          </Stack>

          {/* Alertas de Error e Información */}
          {errorMsg && (
            <Alert color="red" radius="md" title="Error de autenticación">
              {errorMsg}
            </Alert>
          )}

          {successInfo && step === 2 && (
            <Alert color="green" radius="md" title="Código enviado">
              {successInfo}
            </Alert>
          )}

          {/* Formulario Paso 1: Ingreso de Correo */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp}>
              <Stack gap="md">
                <TextInput
                  label="Correo Electrónico Autorizado"
                  placeholder="juanpemonv1994@gmail.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  styles={{
                    label: { color: "#4A503D", fontFamily: "var(--font-subtitle)", fontWeight: 600 },
                    input: { borderColor: "#797E5E" },
                  }}
                />

                <Button
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
                  Iniciar sesión
                </Button>
              </Stack>
            </form>
          )}

          {/* Formulario Paso 2: Ingreso de Código de 6 dígitos */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <Stack gap="md" align="center">
                <Box style={{ width: "100%", display: "flex", justifyContent: "center", py: 10 }}>
                  <PinInput
                    length={6}
                    type="number"
                    size="lg"
                    value={otpCode}
                    onChange={(val) => {
                      setOtpCode(val);
                      if (val.length === 6) {
                        setErrorMsg(null);
                      }
                    }}
                    styles={{
                      input: { borderColor: "#797E5E", fontSize: "1.4rem" },
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  loading={loading}
                  disabled={otpCode.length !== 6}
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
                  Verificar código e Ingresar
                </Button>

                <Group justify="space-between" style={{ width: "100%" }}>
                  <Button
                    variant="subtle"
                    size="xs"
                    color="gray"
                    onClick={handleReset}
                  >
                    ← Cambiar correo
                  </Button>
                  <Button
                    variant="subtle"
                    size="xs"
                    color="green"
                    onClick={handleRequestOtp}
                    loading={loading}
                  >
                    Reenviar código
                  </Button>
                </Group>
              </Stack>
            </form>
          )}

          {/* Botón Volver a la Invitación */}
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
