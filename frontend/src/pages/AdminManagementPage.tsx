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
  IconMail,
  IconCheck,
  IconAlertCircle,
  IconSend,
  IconRefresh,
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
  isConfirmed: boolean;
  inviteToken?: string;
  createdAt: string;
}

export function AdminManagementPage() {
  const { isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Drawer state for + New User
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserItem | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Modal state for Delete confirmation
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUserItem | null>(null);

  // Form setup
  const form = useForm({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      phoneNumber: "+57",
      role: "ADMIN" as "SUPER_ADMIN" | "ADMIN",
    },
    validate: {
      name: (value: string) => (value.trim().length > 0 ? null : "El nombre es obligatorio"),
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "Correo electrónico inválido"),
      phoneNumber: (value: string) => (value.trim().length >= 10 ? null : "Número de celular inválido (mínimo 10 dígitos)"),
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
    });
    openDrawer();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccessMsg(null);

      if (editingAdmin) {
        // Actualizar Admin
        const res = await api.put(`/admins/${editingAdmin.idAdmin}`, values);
        if (res.data.success) {
          setSuccessMsg("Administrador actualizado exitosamente.");
          closeDrawer();
          fetchAdmins();
        } else {
          setError(res.data.message || "Error al actualizar.");
        }
      } else {
        // Crear Nuevo Admin + Enviar Invitación Email
        const res = await api.post("/admins", values);
        if (res.data.success) {
          setSuccessMsg(res.data.message || "Administrador invitado exitosamente por correo.");
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

  const handleResendInvite = async (adminUser: AdminUserItem) => {
    try {
      setSuccessMsg(null);
      const res = await api.post(`/admins/${adminUser.idAdmin}/resend-invite`);
      if (res.data.success) {
        setSuccessMsg(`Correo de invitación reenviado a ${adminUser.email}`);
      } else {
        setError(res.data.message || "Error al reenviar invitación.");
      }
    } catch {
      setError("Ocurrió un error al intentar reenviar la invitación.");
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
            Invitar Administrador
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
            <Table highlightOnHover verticalSpacing="sm" style={{ minWidth: 750 }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre Completo</Table.Th>
                <Table.Th>Correo Electrónico</Table.Th>
                <Table.Th>Celular</Table.Th>
                <Table.Th>Invitación</Table.Th>
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
                    {adm.isConfirmed ? (
                      <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>
                        Confirmado
                      </Badge>
                    ) : (
                      <Badge color="orange" variant="light" leftSection={<IconMail size={12} />}>
                        Pendiente
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
                      {!adm.isConfirmed && (
                        <Tooltip label="Reenviar correo de invitación">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleResendInvite(adm)}
                          >
                            <IconSend size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}

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

      {/* Drawer: + New User / Edit Admin */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={
          <Text fw={700} size="lg" style={{ color: "#4A3F35" }}>
            {editingAdmin ? "Editar Administrador" : "Invitar Administrador"}
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
              {...form.getInputProps("email")}
            />

            <TextInput
              label="Número de Celular (+57 WhatsApp)"
              placeholder="+57 300 123 4567"
              required
              {...form.getInputProps("phoneNumber")}
            />

            <Paper p="sm" radius="md" style={{ backgroundColor: "#FAF8F5", border: "1px solid #EBE3D5" }}>
              <Group gap="xs">
                <IconMail size={18} color="#D4AF37" />
                <Text size="xs" c="dimmed">
                  Al registrar al administrador se generará automáticamente un correo electrónico con el botón <strong>[Aceptar Invitación]</strong>.
                </Text>
              </Group>
            </Paper>

            <Button
              type="submit"
              style={{ backgroundColor: "#797E5E", color: "#FFF" }}
              fullWidth
              loading={submitting}
              mt="lg"
            >
              {editingAdmin ? "Guardar Cambios" : "Enviar Invitación"}
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
