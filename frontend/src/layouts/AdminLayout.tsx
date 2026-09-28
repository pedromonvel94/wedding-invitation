import {
  AppShell,
  Group,
  Title,
  Button,
  Stack,
  Text,
  Burger,
  Badge,
  Avatar,
  Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IconDashboard,
  IconUsersGroup,
  IconUsers,
  IconShieldLock,
  IconLogout,
} from "@tabler/icons-react";

export function AdminLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout, isSuperAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: IconDashboard },
    { label: "Familias / Grupos", path: "/admin/invitations", icon: IconUsersGroup },
    { label: "Lista de Invitados", path: "/admin/guests", icon: IconUsers },
    ...(isSuperAdmin
      ? [{ label: "Administradores", path: "/admin/admins", icon: IconShieldLock }]
      : []),
  ];

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="md" style={{ background: "#4A3F35", color: "#FFFFFF" }}>
        <Group justify="space-between" h="100%">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              color="#FFFFFF"
            />
            <Title order={3} style={{ fontFamily: "serif", color: "#F9F6F0" }}>
              💍 Boda Admin
            </Title>
          </Group>

          <Group gap="md">
            <Group gap="xs" visibleFrom="xs">
              <Avatar color="amber" radius="xl">
                {admin?.name ? admin.name[0].toUpperCase() : "A"}
              </Avatar>
              <Stack gap={0}>
                <Text fw={600} size="sm" style={{ color: "#FFFFFF" }}>
                  {admin?.name} {admin?.lastName || ""}
                </Text>
                <Badge
                  size="xs"
                  variant="filled"
                  color={isSuperAdmin ? "amber" : "blue"}
                >
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </Badge>
              </Stack>
            </Group>

            <Button
              variant="outline"
              color="red"
              size="xs"
              leftSection={<IconLogout size={14} />}
              onClick={handleLogout}
              style={{ borderColor: "#FF6B6B", color: "#FF6B6B" }}
            >
              Cerrar Sesión
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ background: "#FDFBF7" }}>
        <Stack gap="xs">
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" px="xs" mb={5}>
            Navegación
          </Text>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Paper
                key={item.path}
                p="xs"
                radius="md"
                onClick={() => {
                  navigate(item.path);
                  close();
                }}
                style={{
                  cursor: "pointer",
                  backgroundColor: isActive ? "#EBE3D5" : "transparent",
                  color: isActive ? "#4A3F35" : "#666666",
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.2s ease",
                }}
              >
                <Group gap="sm">
                  <Icon size={20} color={isActive ? "#4A3F35" : "#888888"} />
                  <Text size="sm">{item.label}</Text>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main style={{ background: "#FAF8F5", minHeight: "100vh" }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default AdminLayout;
