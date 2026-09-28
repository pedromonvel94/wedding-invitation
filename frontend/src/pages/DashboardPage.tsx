import { useEffect, useState } from "react";
import {
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  RingProgress,
  ThemeIcon,
  Stack,
  Button,
  Table,
  Badge,
  Loader,
  Alert,
  Progress,
  Box,
} from "@mantine/core";
import {
  IconMailCheck,
  IconUserCheck,
  IconClock,
  IconUserX,
  IconPlus,
  IconShieldLock,
  IconUsers,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { api } from "../config/axios";
import { useAuth } from "../context/AuthContext";

interface StatsData {
  invitations: {
    total: number;
    sent: number;
    pending: number;
  };
  guests: {
    total: number;
    confirmed: number;
    pending: number;
    declined: number;
  };
  adminsCount: number;
}

interface RecentInvitation {
  idInvitation: number;
  familyName: string;
  createdAt: string;
  guests: {
    idGuest: number;
    name: string;
    confirmation?: {
      status: "CONFIRMED" | "PENDING" | "DECLINED";
    };
  }[];
  invitationDeliveries: {
    status: "PENDING" | "SENT" | "FAILED";
  }[];
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { admin, isSuperAdmin } = useAuth();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentInvitations, setRecentInvitations] = useState<RecentInvitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/dashboard/stats");
      if (response.data.success) {
        setStats(response.data.stats);
        setRecentInvitations(response.data.recentInvitations || []);
      } else {
        setError(response.data.message || "Error al cargar las estadísticas.");
      }
    } catch {
      setError("No se pudo conectar con el servidor para cargar las estadísticas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Stack align="center" justify="center" h={400}>
        <Loader size="lg" color="amber" />
        <Text c="dimmed">Cargando métricas del panel administrativo...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
        {error}
      </Alert>
    );
  }

  const sentPercentage =
    stats && stats.invitations.total > 0
      ? Math.round((stats.invitations.sent / stats.invitations.total) * 100)
      : 0;

  const confirmedPercentage =
    stats && stats.guests.total > 0
      ? Math.round((stats.guests.confirmed / stats.guests.total) * 100)
      : 0;

  return (
    <Stack gap="lg">
      {/* Header Bienvenida */}
      <Paper p="xl" radius="md" style={{ background: "linear-gradient(135deg, #4A3F35 0%, #2A241F 100%)", color: "#FFF" }}>
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={2} style={{ color: "#FAF8F5", fontFamily: "serif" }}>
              ¡Hola, {admin?.name || "Administrador"}! 👋
            </Title>
            <Text size="sm" c="gray.3">
              Bienvenido al centro de control de tu boda. Revisa el estado de tus invitaciones y confirmaciones en tiempo real.
            </Text>
          </Stack>
          <Group gap="sm">
            <Button
              variant="light"
              color="amber"
              leftSection={<IconPlus size={16} />}
              onClick={() => navigate("/admin/invitations")}
            >
              Nueva Invitación
            </Button>
            {isSuperAdmin && (
              <Button
                variant="outline"
                color="gray"
                style={{ borderColor: "#D4AF37", color: "#D4AF37" }}
                leftSection={<IconShieldLock size={16} />}
                onClick={() => navigate("/admin/admins")}
              >
                Administradores ({stats?.adminsCount || 1})
              </Button>
            )}
          </Group>
        </Group>
      </Paper>

      {/* Tarjetas de Estadísticas Principales */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {/* Tarjeta 1: Invitaciones Enviadas */}
        <Paper p="md" radius="md" withBorder style={{ backgroundColor: "#FFF" }}>
          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                Invitaciones Enviadas
              </Text>
              <Title order={2} style={{ color: "#4A3F35" }}>
                {stats?.invitations.sent} / {stats?.invitations.total}
              </Title>
            </Stack>
            <ThemeIcon color="blue" size={48} radius="md" variant="light">
              <IconMailCheck size={26} />
            </ThemeIcon>
          </Group>
          <Progress value={sentPercentage} color="blue" mt="md" size="sm" radius="xl" />
          <Text size="xs" c="dimmed" mt={5}>
            {sentPercentage}% de invitaciones entregadas
          </Text>
        </Paper>

        {/* Tarjeta 2: Asistencias Confirmadas */}
        <Paper p="md" radius="md" withBorder style={{ backgroundColor: "#FFF" }}>
          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                Invitados Confirmados
              </Text>
              <Title order={2} style={{ color: "#2E7D32" }}>
                {stats?.guests.confirmed}
              </Title>
            </Stack>
            <ThemeIcon color="teal" size={48} radius="md" variant="light">
              <IconUserCheck size={26} />
            </ThemeIcon>
          </Group>
          <Progress value={confirmedPercentage} color="teal" mt="md" size="sm" radius="xl" />
          <Text size="xs" c="dimmed" mt={5}>
            {confirmedPercentage}% del total de {stats?.guests.total} invitados
          </Text>
        </Paper>

        {/* Tarjeta 3: Confirmaciones Pendientes */}
        <Paper p="md" radius="md" withBorder style={{ backgroundColor: "#FFF" }}>
          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                Pendientes de Respuesta
              </Text>
              <Title order={2} style={{ color: "#E65100" }}>
                {stats?.guests.pending}
              </Title>
            </Stack>
            <ThemeIcon color="orange" size={48} radius="md" variant="light">
              <IconClock size={26} />
            </ThemeIcon>
          </Group>
          <Progress
            value={stats && stats.guests.total > 0 ? Math.round((stats.guests.pending / stats.guests.total) * 100) : 0}
            color="orange"
            mt="md"
            size="sm"
            radius="xl"
          />
          <Text size="xs" c="dimmed" mt={5}>
            Pendientes por responder
          </Text>
        </Paper>

        {/* Tarjeta 4: Asistencias Rechazadas */}
        <Paper p="md" radius="md" withBorder style={{ backgroundColor: "#FFF" }}>
          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                Asistencias Rechazadas
              </Text>
              <Title order={2} style={{ color: "#C62828" }}>
                {stats?.guests.declined}
              </Title>
            </Stack>
            <ThemeIcon color="red" size={48} radius="md" variant="light">
              <IconUserX size={26} />
            </ThemeIcon>
          </Group>
          <Progress
            value={stats && stats.guests.total > 0 ? Math.round((stats.guests.declined / stats.guests.total) * 100) : 0}
            color="red"
            mt="md"
            size="sm"
            radius="xl"
          />
          <Text size="xs" c="dimmed" mt={5}>
            No podrán asistir
          </Text>
        </Paper>
      </SimpleGrid>

      {/* Resumen Visual & Acciones Rápidas */}
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        <Paper p="lg" radius="md" withBorder style={{ backgroundColor: "#FFF" }}>
          <Stack align="center" justify="center">
            <Text fw={700} size="sm" c="dimmed">
              DISTRIBUCIÓN DE ASISTENCIA
            </Text>
            <RingProgress
              size={180}
              thickness={16}
              roundCaps
              sections={[
                { value: stats?.guests.total ? (stats.guests.confirmed / stats.guests.total) * 100 : 0, color: "teal", tooltip: "Confirmados" },
                { value: stats?.guests.total ? (stats.guests.pending / stats.guests.total) * 100 : 0, color: "orange", tooltip: "Pendientes" },
                { value: stats?.guests.total ? (stats.guests.declined / stats.guests.total) * 100 : 0, color: "red", tooltip: "Rechazados" },
              ]}
              label={
                <Stack gap={0} align="center">
                  <Text fw={700} size="xl" style={{ color: "#4A3F35" }}>
                    {stats?.guests.total || 0}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Invitados
                  </Text>
                </Stack>
              }
            />
            <Group gap="xs" justify="center">
              <Badge color="teal" variant="dot">Confirmados: {stats?.guests.confirmed}</Badge>
              <Badge color="orange" variant="dot">Pendientes: {stats?.guests.pending}</Badge>
              <Badge color="red" variant="dot">Rechazados: {stats?.guests.declined}</Badge>
            </Group>
          </Stack>
        </Paper>

        <Paper p="lg" radius="md" withBorder style={{ backgroundColor: "#FFF", gridColumn: "span 2" }}>
          <Group justify="space-between" mb="md">
            <Stack gap={0}>
              <Title order={4} style={{ color: "#4A3F35" }}>
                Invitaciones Creadas Recientemente
              </Title>
              <Text size="xs" c="dimmed">
                Últimas familias agregadas al sistema
              </Text>
            </Stack>
            <Button variant="subtle" size="xs" onClick={() => navigate("/admin/invitations")}>
              Ver todas
            </Button>
          </Group>

          {recentInvitations.length === 0 ? (
            <Stack align="center" py="xl">
              <IconUsers size={36} color="#CCCCCC" />
              <Text size="sm" c="dimmed">
                No hay invitaciones registradas aún. ¡Crea la primera!
              </Text>
              <Button size="xs" color="amber" onClick={() => navigate("/admin/invitations")}>
                Crear Invitación
              </Button>
            </Stack>
          ) : (
            <Box style={{ overflowX: "auto", width: "100%", WebkitOverflowScrolling: "touch" }}>
              <Table highlightOnHover verticalSpacing="xs" style={{ minWidth: 500 }}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Familia / Nombre</Table.Th>
                    <Table.Th>Invitados</Table.Th>
                    <Table.Th>Estado Envío</Table.Th>
                    <Table.Th>Fecha Registro</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {recentInvitations.map((inv) => {
                    const isSent = inv.invitationDeliveries.some((d) => d.status === "SENT");
                    return (
                      <Table.Tr key={inv.idInvitation}>
                        <Table.Td fw={600}>{inv.familyName}</Table.Td>
                        <Table.Td>
                          <Badge variant="light" color="gray">
                            {inv.guests.length} invitado(s)
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={isSent ? "green" : "yellow"}>
                            {isSent ? "Enviado" : "Pendiente"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs" c="dimmed">
                            {new Date(inv.createdAt).toLocaleDateString("es-CO")}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Box>
          )}
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}

export default DashboardPage;
