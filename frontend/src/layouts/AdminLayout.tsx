import { AppShell, Group, Title, Button, Stack, UnstyledButton, Text } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: "sm" }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group justify="space-between" h="100%">
          <Title order={3} style={{ color: "#4A3F35" }}>
            Panel de Administración — Boda
          </Title>
          <Button variant="outline" color="red" size="xs" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <UnstyledButton p="sm" onClick={() => navigate("/admin")}>
            <Text fw={500}>Dashboard</Text>
          </UnstyledButton>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default AdminLayout;
