import { useEffect, useState } from "react";
import {
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Button,
  Table,
  Badge,
  ActionIcon,
  Drawer,
  TextInput,
  PasswordInput,
  Loader,
  Alert,
  Modal,
  Switch,
  Tooltip,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconAlertCircle,
  IconRefresh,
  IconKey,
} from "@tabler/icons-react";
import { api } from "../config/axios";
import { useAuth } from "../context/AuthContext";

interface AdminUserItem {
  idAdmin: number;
  name: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  role: "SUPER_ADMIN" | "ADMIN";
  active: boolean;
  mustChangePassword: boolean;
  createdAt: string;
}

export function AdminManagementPage() {
  const { isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserItem | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUserItem | null>(null);

  const form = useForm({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      phoneNumber: "+57",
      role: "ADMIN" as "SUPER_ADMIN" | "ADMIN",
      tempPassword: "",
      resetPassword: "",
    },
    validate: {
      name: (value: string) => (value.trim().length > 0 ? null : "El nombre es obligatorio"),
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "Correo electrónico inválido"),
      phoneNumber: (value: string) => (value.trim().length >= 10 ? null : "Número de celular inválido (mínimo 10 dígitos)"),
      tempPassword: (value: string) =>
        !editingAdmin && value.length < 6 ? "La contraseña temporal debe tener al menos 6 caracteres" : null,
    },
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admins");
      if (response.data.success) {
        const adminList = response.data.admins || response.data.data || [];
        setAdmins(Array.isArray(adminList) ? adminList : []);
      } else {
        setError(response.data.message || "Error al cargar la lista de administradores.");
      }
    } catch {
      setError("No tiene permisos o ocurrió un error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenCreateDrawer = () => {
    setEditingAdmin(null);
    form.reset();
    form.setFieldValue("phoneNumber", "+57 ");
    openDrawer();
  };

  const handleOpenEditDrawer = (adminUser: AdminUserItem) => {
    setEditingAdmin(adminUser);
    form.setValues({
      name: adminUser.name,
      lastName: adminUser.lastName || "",
      email: adminUser.email,
      phoneNumber: adminUser.phoneNumber || "+57 ",
      role: adminUser.role,
      tempPassword: "",
      resetPassword: "",
    });
    openDrawer();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccessMsg(null);

      if (editingAdmin) {
        const payload: Record<string, unknown> = {
          name: values.name,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          role: values.role,
        };
        if (values.resetPassword && values.resetPassword.length >= 6) {
          payload.resetPassword = values.resetPassword;
        }
        const res = await api.put(`/admins/${editingAdmin.idAdmin}`, payload);
        if (res.data.success) {
          setSuccessMsg("Administrador actualizado exitosamente.");
          closeDrawer();
          fetchAdmins();
        } else {
          setError(res.data.message || "Error al actualizar.");
        }
      } else {
        const res = await api.post("/admins", {
          name: values.name,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          role: values.role,
          tempPassword: values.tempPassword,
        });
        if (res.data.success) {
          setSuccessMsg(res.data.message || "Administrador creado exitosamente.");
          closeDrawer();
          fetchAdmins();
        } else {
          setError(res.data.message || "Error al crear el usuario.");
        }
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Error al procesar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (adminUser: AdminUserItem) => {
    try {
      const newStatus = !adminUser.active;
      const res = await api.put(`/admins/${adminUser.idAdmin}`, { active: newStatus });
      if (res.data.success) {
        fetchAdmins();
      }
    } catch {
      setError("No se pudo cambiar el estado del administrador.");
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      const res = await api.delete(`/admins/${adminToDelete.idAdmin}`);
      if (res.data.success) {
        setSuccessMsg("Administrador eliminado correctamente.");
        closeDeleteModal();
        fetchAdmins();
      } else {
        setError(res.data.message || "Error al eliminar administrador.");
      }
    } catch {
      setError("No se pudo eliminar el administrador.");
    }
  };

  if (!isSuperAdmin) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Acceso Denegado" color="red">
        Esta sección está reservada exclusivamente para el Super Administrador.
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Paper p="lg" radius="md" style={{ background: "#4A3F35", color: "#FFF" }}>
        <Group justify="space-between" align="center">
          <Stack gap={0}>
            <Title order={2} style={{ color: "#FFF", fontFamily: "serif" }}>
              👑 Gestión de Administradores
            </Title>
            <Text size="sm" c="gray.3">
              Administra los usuarios autorizados para ingresar al panel de control de la boda.
            </Text>
          </Stack>
          <Button
            style={{ backgroundColor: "#797E5E", color: "#FFF" }}
            leftSection={<IconPlus size={16} />}
            onClick={handleOpenCreateDrawer}
          >
            Nuevo Administrador
          </Button>
        </Group>
      </Paper>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" withCloseButton onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMsg && (
        <Alert icon={<IconCheck size={16} />} title="Éxito" color="teal" withCloseButton onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      <Paper p="md" radius="md" withBorder style={{ backgroundColor: "#FFF" }}>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="md" c="dimmed">
            USUARIOS ADMINISTRADORES REGISTRADOS ({admins.length})
          </Text>
          <ActionIcon variant="light" color="gray" onClick={fetchAdmins}>
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>

        {loading ? (
          <Stack align="center" py="xl">
            <Loader size="md" color="orange" />
          </Stack>
        ) : (
          <Box style={{ overflowX: "auto", width: "100%", WebkitOverflowScrolling: "touch" }}>
            <Table highlightOnHover verticalSpacing="sm" style={{ minWidth: 700 }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nombre Completo</Table.Th>
                  <Table.Th>Correo Electrónico</Table.Th>
                  <Table.Th>Celular</Table.Th>
                  <Table.Th>Rol</Table.Th>
                  <Table.Th>Contraseña</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {admins.map((adm) => (
                  <Table.Tr key={adm.idAdmin}>
                    <Table.Td fw={600}>
                      {adm.name} {adm.lastName || ""}
                    </Table.Td>
                    <Table.Td>{adm.email}</Table.Td>
                    <Table.Td>{adm.phoneNumber || "N/A"}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={adm.role === "SUPER_ADMIN" ? "grape" : "blue"}
                        variant="light"
                        size="sm"
                      >
                        {adm.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {adm.mustChangePassword ? (
                        <Badge color="orange" variant="light" leftSection={<IconKey size={10} />} size="sm">
                          Temporal
                        </Badge>
                      ) : (
                        <Badge color="green" variant="light" leftSection={<IconCheck size={10} />} size="sm">
                          Configurada
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Switch
                        checked={adm.active}
                        onChange={() => handleToggleActive(adm)}
                        disabled={adm.role === "SUPER_ADMIN"}
                        size="sm"
                        color="teal"
                        label={adm.active ? "Activo" : "Inactivo"}
                      />
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Group gap="xs" justify="flex-end">
                        <Tooltip label="Editar administrador">
                          <ActionIcon
                            variant="light"
                            color="orange"
                            onClick={() => handleOpenEditDrawer(adm)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>

                        {adm.role !== "SUPER_ADMIN" && (
                          <Tooltip label="Eliminar administrador">
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => {
                                setAdminToDelete(adm);
                                openDeleteModal();
                              }}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        )}
      </Paper>

      {/* Drawer: Crear / Editar Admin */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={
          <Text fw={700} size="lg" style={{ color: "#4A3F35" }}>
            {editingAdmin ? "Editar Administrador" : "Nuevo Administrador"}
          </Text>
        }
        position="right"
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md" mt="md">
            <TextInput
              label="Nombre"
              placeholder="Ej. Carlos"
              required
              {...form.getInputProps("name")}
            />

            <TextInput
              label="Apellidos"
              placeholder="Ej. Gómez"
              {...form.getInputProps("lastName")}
            />

            <TextInput
              label="Correo Electrónico"
              placeholder="admin@ejemplo.com"
              required
              disabled={!!editingAdmin}
              {...form.getInputProps("email")}
            />

            <TextInput
              label="Número de Celular"
              placeholder="+57 300 123 4567"
              required
              {...form.getInputProps("phoneNumber")}
            />

            {/* Solo en creación: contraseña temporal obligatoria */}
            {!editingAdmin && (
              <PasswordInput
                label="Contraseña Temporal"
                placeholder="Mínimo 6 caracteres"
                description="El admin deberá cambiarla en su primer inicio de sesión"
                required
                {...form.getInputProps("tempPassword")}
              />
            )}

            {/* Solo en edición: resetear contraseña (opcional) */}
            {editingAdmin && (
              <PasswordInput
                label="Restablecer Contraseña (opcional)"
                placeholder="Deja vacío para no cambiar"
                description="Si ingresas una nueva contraseña, el admin deberá cambiarla al iniciar sesión"
                {...form.getInputProps("resetPassword")}
              />
            )}

            <Button
              type="submit"
              style={{ backgroundColor: "#797E5E", color: "#FFF" }}
              fullWidth
              loading={submitting}
              mt="lg"
            >
              {editingAdmin ? "Guardar Cambios" : "Crear Administrador"}
            </Button>
          </Stack>
        </form>
      </Drawer>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar Eliminación"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            ¿Estás seguro de que deseas eliminar al administrador{" "}
            <strong>{adminToDelete?.name} {adminToDelete?.lastName}</strong> ({adminToDelete?.email})? Esta acción no se puede deshacer.
          </Text>
          <Group justify="flex-end">
            <Button variant="outline" color="gray" onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button color="red" onClick={handleDeleteAdmin}>
              Sí, Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default AdminManagementPage;
