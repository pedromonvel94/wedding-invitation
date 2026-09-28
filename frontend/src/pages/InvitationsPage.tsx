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
  TextInput,
  Select,
  Modal,
  Loader,
  Alert,
  Tooltip,
  Menu,
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
  IconSearch,
  IconRefresh,
  IconDotsVertical,
  IconUsers,
  IconHeart,
} from "@tabler/icons-react";
import { api } from "../config/axios";

interface Guest {
  idGuest: number;
  name: string;
  phoneNumber: string;
  email: string;
  side?: "PEDRO" | "CATA" | "BOTH";
  confirmation?: {
    status: "CONFIRMED" | "PENDING" | "DECLINED";
  };
}

interface InvitationItem {
  idInvitation: number;
  familyName: string;
  side?: "PEDRO" | "CATA" | "BOTH";
  createdAt: string;
  guests: Guest[];
  invitationDeliveries: {
    idDelivery: number;
    channel?: "EMAIL" | "WHATSAPP";
    status: "PENDING" | "SENT" | "FAILED";
    sentAt?: string;
  }[];
}

export function InvitationsPage() {
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sideFilter, setSideFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal Create/Edit
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editingInvitation, setEditingInvitation] = useState<InvitationItem | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Modal Delete
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [invitationToDelete, setInvitationToDelete] = useState<InvitationItem | null>(null);

  const form = useForm({
    initialValues: {
      familyName: "",
      side: "PEDRO" as "PEDRO" | "CATA" | "BOTH",
    },
    validate: {
      familyName: (val: string) => (val.trim().length > 0 ? null : "El nombre de la familia es requerido"),
    },
  });

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/invitations");
      if (res.data.success) {
        setInvitations(res.data.invitations || res.data.data || []);
      } else {
        setError(res.data.message || "Error al cargar las invitaciones.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleOpenCreate = () => {
    setEditingInvitation(null);
    form.reset();
    openModal();
  };

  const handleOpenEdit = (inv: InvitationItem) => {
    setEditingInvitation(inv);
    form.setValues({
      familyName: inv.familyName,
      side: inv.side || "BOTH",
    });
    openModal();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSubmitting(true);
      setError(null);

      if (editingInvitation) {
        const res = await api.put(`/invitations/${editingInvitation.idInvitation}`, values);
        if (res.data.success) {
          setSuccessMsg("Invitación actualizada correctamente.");
          closeModal();
          fetchInvitations();
        } else {
          setError(res.data.message || "Error al actualizar.");
        }
      } else {
        const res = await api.post("/invitations", values);
        if (res.data.success) {
          setSuccessMsg("Invitación creada exitosamente.");
          closeModal();
          fetchInvitations();
        } else {
          setError(res.data.message || "Error al crear la invitación.");
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || "Error en la operación.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!invitationToDelete) return;
    try {
      const res = await api.delete(`/invitations/${invitationToDelete.idInvitation}`);
      if (res.data.success) {
        setSuccessMsg("Invitación eliminada correctamente.");
        closeDeleteModal();
        fetchInvitations();
      } else {
        setError(res.data.message || "Error al eliminar la invitación.");
      }
    } catch {
      setError("No se pudo eliminar la invitación.");
    }
  };

  const filteredInvitations = invitations.filter((inv) => {
    const matchSearch = inv.familyName.toLowerCase().includes(search.toLowerCase());
    const side = inv.side || "BOTH";
    const matchSide = sideFilter === "ALL" || side === sideFilter;
    return matchSearch && matchSide;
  });

  return (
    <Stack gap="lg">
      <Paper p="lg" radius="md" style={{ background: "#4A3F35", color: "#FFF" }}>
        <Group justify="space-between" align="center">
          <Stack gap={0}>
            <Title order={2} style={{ color: "#FFF", fontFamily: "serif" }}>
              👨‍👩‍👧‍👦 Gestión de Familias
            </Title>
            <Text size="sm" c="gray.3">
              Crea y administra los grupos o familias de la boda. Especifica si pertenecen al lado de Pedro o de Cata.
            </Text>
          </Stack>
          <Button
            style={{ backgroundColor: "#D4AF37", color: "#4A3F35", fontWeight: 700 }}
            leftSection={<IconPlus size={16} />}
            onClick={handleOpenCreate}
          >
            Nueva Familia
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
        <Group justify="space-between" mb="md" wrap="wrap" gap="sm">
          <TextInput
            placeholder="Buscar por apellido o nombre de familia..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 200 }}
          />

          <Group gap="xs">
            <Select
              placeholder="Lado"
              value={sideFilter}
              onChange={(val) => setSideFilter(val || "ALL")}
              data={[
                { label: "Todos", value: "ALL" },
                { label: "💙 Pedro", value: "PEDRO" },
                { label: "🩷 Cata", value: "CATA" },
                { label: "💑 Ambos", value: "BOTH" },
              ]}
              style={{ width: 140 }}
              styles={{
                input: { backgroundColor: "#FAF8F5", borderColor: "#DDD", color: "#4A503D" },
              }}
            />

            <ActionIcon variant="light" color="gray" onClick={fetchInvitations} size="lg">
              <IconRefresh size={16} />
            </ActionIcon>
          </Group>
        </Group>

        {loading ? (
          <Stack align="center" py="xl">
            <Loader color="amber" size="md" />
          </Stack>
        ) : filteredInvitations.length === 0 ? (
          <Stack align="center" py="xl">
            <IconUsers size={36} color="#CCC" />
            <Text c="dimmed">No se encontraron familias registradas.</Text>
          </Stack>
        ) : (
          <Box style={{ overflowX: "auto", width: "100%", WebkitOverflowScrolling: "touch" }}>
            <Table highlightOnHover verticalSpacing="sm" style={{ minWidth: 800 }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Familia / Grupo</Table.Th>
                  <Table.Th>Invitado por (Lado)</Table.Th>
                  <Table.Th>Integrantes Totales</Table.Th>
                  <Table.Th>Asistencia Confirmada</Table.Th>
                  <Table.Th>Estado de Entrega</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredInvitations.map((inv) => {
                  const isSent = inv.invitationDeliveries.some((d) => d.status === "SENT");
                  const side = inv.side || "BOTH";
                  const confirmedCount = inv.guests.filter((g) => g.confirmation?.status === "CONFIRMED").length;
                  const totalGuests = inv.guests.length;

                  return (
                    <Table.Tr key={inv.idInvitation}>
                      <Table.Td fw={500}>#{inv.idInvitation}</Table.Td>
                      <Table.Td fw={600} style={{ color: "#4A3F35" }}>
                        {inv.familyName}
                      </Table.Td>
                      <Table.Td>
                        {side === "PEDRO" && (
                          <Badge color="blue" variant="light">
                            💙 Pedro
                          </Badge>
                        )}
                        {side === "CATA" && (
                          <Badge color="pink" variant="light">
                            🩷 Cata
                          </Badge>
                        )}
                        {side === "BOTH" && (
                          <Badge color="amber" variant="light" leftSection={<IconHeart size={12} />}>
                            💑 Ambos
                          </Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="gray">
                          {totalGuests} integrante(s)
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={confirmedCount > 0 ? "teal" : "orange"} variant="light">
                          {confirmedCount} de {totalGuests} confirmados
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={isSent ? "green" : "yellow"} variant="filled">
                          {isSent ? "Entregada" : "Sin Enviar"}
                        </Badge>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        <Group gap="xs" justify="flex-end">
                          <Tooltip label="Editar familia">
                            <ActionIcon
                              variant="light"
                              color="amber"
                              onClick={() => handleOpenEdit(inv)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>

                          <Menu position="bottom-end" shadow="md">
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => {
                                  setInvitationToDelete(inv);
                                  openDeleteModal();
                                }}
                              >
                                Eliminar
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Box>
        )}
      </Paper>

      {/* Modal Crear / Editar Familia */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={editingInvitation ? "Editar Familia" : "Nueva Familia"}
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nombre de la Familia o Grupo"
              placeholder="Ej. Familia Pérez Montoya"
              required
              {...form.getInputProps("familyName")}
            />

            <Select
              label="Invitado por (Lado de la Familia)"
              data={[
                { value: "PEDRO", label: "💙 Pedro" },
                { value: "CATA", label: "🩷 Cata" },
                { value: "BOTH", label: "💑 Ambos / Amigos en Común" },
              ]}
              required
              {...form.getInputProps("side")}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="outline" color="gray" onClick={closeModal}>
                Cancelar
              </Button>
              <Button
                style={{ backgroundColor: "#4A3F35", color: "#FFFFFF", fontWeight: 600 }}
                type="submit"
                loading={submitting}
              >
                {editingInvitation ? "Guardar Cambios" : "Crear Familia"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal Eliminar */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar Eliminación"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            ¿Deseas eliminar la invitación de la <strong>{invitationToDelete?.familyName}</strong>? Esta acción eliminará también sus asistentes vinculados.
          </Text>
          <Group justify="flex-end">
            <Button variant="outline" color="gray" onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button color="red" onClick={handleDelete}>
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default InvitationsPage;
