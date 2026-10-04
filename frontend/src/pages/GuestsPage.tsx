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
  Checkbox,
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
  IconUserCheck,
  IconUserX,
  IconClock,
  IconUsers,
  IconHeart,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { api } from "../config/axios";
import { useAuth } from "../context/AuthContext";

interface GuestItem {
  idGuest: number;
  name: string;
  phoneNumber: string;
  email?: string;
  side?: "PEDRO" | "CATA" | "BOTH";
  invitationId: number;
  invitation?: {
    idInvitation: number;
    familyName: string;
    side?: "PEDRO" | "CATA" | "BOTH";
    invitationDeliveries?: Array<{
      idDelivery: number;
      channel?: string;
      status: "PENDING" | "SENT" | "FAILED";
    }>;
  };
  confirmation?: {
    idConfirmation: number;
    status: "CONFIRMED" | "PENDING" | "DECLINED";
    responseDate?: string;
  };
}

interface InvitationSimple {
  idInvitation: number;
  familyName: string;
  side: "PEDRO" | "CATA" | "BOTH";
}

const COUNTRY_CODES = [
  { value: "+57", label: "🇨🇴 Colombia (+57)" },
  { value: "+1", label: "🇺🇸/🇨🇦 EE.UU. / Canadá (+1)" },
  { value: "+34", label: "🇪🇸 España (+34)" },
  { value: "+52", label: "🇲🇽 México (+52)" },
  { value: "+54", label: "🇦🇷 Argentina (+54)" },
  { value: "+56", label: "🇨🇱 Chile (+56)" },
  { value: "+51", label: "🇵🇪 Perú (+51)" },
  { value: "+593", label: "🇪🇨 Ecuador (+593)" },
  { value: "+58", label: "🇻🇪 Venezuela (+58)" },
  { value: "+507", label: "🇵🇦 Panamá (+507)" },
  { value: "+506", label: "🇨🇷 Costa Rica (+506)" },
  { value: "+502", label: "🇬🇹 Guatemala (+502)" },
  { value: "+503", label: "🇸🇻 El Salvador (+503)" },
  { value: "+55", label: "🇧🇷 Brasil (+55)" },
  { value: "+44", label: "🇬🇧 Reino Unido (+44)" },
  { value: "+33", label: "🇫🇷 Francia (+33)" },
  { value: "+49", label: "🇩🇪 Alemania (+49)" },
  { value: "+39", label: "🇮🇹 Italia (+39)" },
  { value: "+41", label: "🇨🇭 Suiza (+41)" },
  { value: "+61", label: "🇦🇺 Australia (+61)" },
  { value: "OTHER", label: "✏️ Otro indicativo..." },
];

const parsePhoneNumber = (phone: string) => {
  const trimmed = (phone || "").trim();
  if (!trimmed) {
    return { countryCode: "+57", customCountryCode: "", phoneBody: "" };
  }
  if (trimmed.startsWith("+")) {
    const matched = COUNTRY_CODES.find(
      (c) => c.value !== "OTHER" && trimmed.startsWith(c.value)
    );
    if (matched) {
      const rest = trimmed.slice(matched.value.length).trim();
      return { countryCode: matched.value, customCountryCode: "", phoneBody: rest };
    } else {
      const matchCustom = trimmed.match(/^(\+\d{1,4})\s*(.*)$/);
      if (matchCustom) {
        return {
          countryCode: "OTHER",
          customCountryCode: matchCustom[1],
          phoneBody: matchCustom[2],
        };
      }
    }
  }
  const cleanedBody = trimmed.replace(/^57\s*/, "");
  return { countryCode: "+57", customCountryCode: "", phoneBody: cleanedBody };
};

export function GuestsPage() {
  const { admin } = useAuth();
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [invitationsList, setInvitationsList] = useState<InvitationSimple[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sideFilter, setSideFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal Create/Edit
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Modal Delete
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [guestToDelete, setGuestToDelete] = useState<GuestItem | null>(null);

  const form = useForm({
    initialValues: {
      name: "",
      countryCode: "+57",
      customCountryCode: "",
      phoneBody: "",
      email: "",
      side: "" as "" | "PEDRO" | "CATA" | "BOTH",
      invitationId: "",
    },
    validate: {
      name: (val: string) => (val.trim().length > 0 ? null : "El nombre es requerido"),
      phoneBody: (val: string) => (val.trim().length >= 6 ? null : "Número de celular inválido"),
      customCountryCode: (val: string, values) =>
        values.countryCode === "OTHER" && !val.trim().startsWith("+")
          ? "El indicativo debe empezar por + (ej. +43)"
          : null,
      side: (val: string) => (val ? null : "Debes seleccionar de qué lado es el invitado"),
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [guestsRes, invRes] = await Promise.all([
        api.get("/guests"),
        api.get("/invitations"),
      ]);

      if (guestsRes.data.success) {
        setGuests(guestsRes.data.guests);
      }
      if (invRes.data.success) {
        setInvitationsList(invRes.data.invitations);
      }
    } catch {
      setError("No se pudo cargar la lista de invitados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingGuest(null);
    form.reset();
    form.setValues({
      name: "",
      countryCode: "+57",
      customCountryCode: "",
      phoneBody: "",
      email: "",
      side: "",
      invitationId: "",
    });
    openModal();
  };

  const handleOpenEdit = (guest: GuestItem) => {
    setEditingGuest(guest);
    const parsedPhone = parsePhoneNumber(guest.phoneNumber);
    form.setValues({
      name: guest.name,
      countryCode: parsedPhone.countryCode,
      customCountryCode: parsedPhone.customCountryCode,
      phoneBody: parsedPhone.phoneBody,
      email: guest.email || "",
      side: guest.side || guest.invitation?.side || "",
      invitationId: guest.invitationId ? String(guest.invitationId) : "",
    });
    openModal();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSubmitting(true);
      setError(null);

      const prefix = values.countryCode === "OTHER" ? values.customCountryCode.trim() : values.countryCode;
      const fullPhoneNumber = `${prefix} ${values.phoneBody.trim()}`;

      if (editingGuest) {
        const res = await api.put(`/guests/${editingGuest.idGuest}`, {
          name: values.name,
          phoneNumber: fullPhoneNumber,
          email: values.email || undefined,
          side: values.side,
          invitationId: values.invitationId ? Number(values.invitationId) : null,
        });
        if (res.data.success) {
          setSuccessMsg("Invitado actualizado correctamente.");
          closeModal();
          fetchData();
        } else {
          setError(res.data.message || "Error al actualizar.");
        }
      } else {
        const res = await api.post("/guests", {
          name: values.name,
          phoneNumber: fullPhoneNumber,
          email: values.email || undefined,
          side: values.side,
          invitationId: values.invitationId ? Number(values.invitationId) : undefined,
        });
        if (res.data.success) {
          setSuccessMsg("Invitado registrado exitosamente.");
          closeModal();
          fetchData();
        } else {
          setError(res.data.message || "Error al registrar invitado.");
        }
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      setError(errObj.response?.data?.message || "Error en la operación.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!guestToDelete) return;
    try {
      const res = await api.delete(`/guests/${guestToDelete.idGuest}`);
      if (res.data.success) {
        setSuccessMsg("Invitado eliminado correctamente.");
        closeDeleteModal();
        fetchData();
      } else {
        setError(res.data.message || "Error al eliminar invitado.");
      }
    } catch {
      setError("No se pudo eliminar el invitado.");
    }
  };

  const handleToggleSent = async (gst: GuestItem) => {
    const isSent = gst.invitation?.invitationDeliveries?.some((d) => d.status === "SENT") || false;
    const newStatus = isSent ? "PENDING" : "SENT";
    try {
      await api.post(`/invitations/${gst.invitationId}/mark-sent`, { channel: "WHATSAPP", status: newStatus });
      fetchData();
    } catch {
      setError("No se pudo actualizar el estado de envío.");
    }
  };

  const handleSendWhatsApp = async (gst: GuestItem) => {
    const phone = (gst.phoneNumber || "").trim();
    let formattedPhone = "";

    if (phone.startsWith("+")) {
      // Si ya tiene indicativo internacional explícito (+1 2035568068 -> 12035568068)
      formattedPhone = phone.replace(/\D/g, "");
    } else {
      // Para números legacy sin '+'
      const cleanDigits = phone.replace(/\D/g, "");
      if (cleanDigits.startsWith("57") && cleanDigits.length >= 12) {
        formattedPhone = cleanDigits;
      } else {
        formattedPhone = `57${cleanDigits}`;
      }
    }

    const invitationUrl = `${window.location.origin}/?invitation=${gst.invitationId}`;
    
    // Identificar de qué lado es el invitado para el saludo dinámico
    const side = gst.side || gst.invitation?.side || "BOTH";
    let dynamicGreeting = "Pedro y yo";
    if (side === "CATA") {
      dynamicGreeting = "Pedro y yo";
    } else if (side === "PEDRO") {
      dynamicGreeting = "Cata y yo";
    } else {
      dynamicGreeting = admin?.email === "catalina7596@hotmail.com" ? "Pedro y yo" : "Cata y yo";
    }

    const messageText = `Se acabo la espera!!\n\u{1F973}\u{1F57A}\u{1F3FC} \u{1F389} ${gst.name}! \u{1F389} Con gran alegría ${dynamicGreeting} queremos invitarte a celebrar nuestra Boda. \u{1F470}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}\u{1F935}\u{1F3FB}\u{200D}\u{2642}\u{FE0F} La invitación se encuentra en el siguiente link:\n\n${invitationUrl}\n\n¡Esperamos contar con tu presencia! \nNo olvides confirmar tu asistencia antes del 15 de Octubre! \u{2705}`;

    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`, "_blank");

    try {
      await api.post(`/invitations/${gst.invitationId}/mark-sent`, { channel: "WHATSAPP", status: "SENT" });
      fetchData();
    } catch {
      // Ignorar si falla el registro silencioso
    }
  };

  const filteredGuests = guests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (g.invitation?.familyName || "").toLowerCase().includes(search.toLowerCase());

    const status = g.confirmation?.status || "PENDING";
    const matchStatus = statusFilter === "ALL" || status === statusFilter;

    const side = g.side || g.invitation?.side || "BOTH";
    const matchSide = sideFilter === "ALL" || side === sideFilter;

    return matchSearch && matchStatus && matchSide;
  });

  return (
    <Stack gap="lg">
      <Paper p={{ base: "md", sm: "lg" }} radius="md" style={{ background: "#4A3F35", color: "#FFF" }}>
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          <Stack gap={0} style={{ flex: 1, minWidth: 220 }}>
            <Title order={2} style={{ color: "#FFF", fontFamily: "serif" }}>
              👥 Lista de Invitados
            </Title>
            <Text size="sm" c="gray.3">
              Administra los miembros individuales de cada familia y consulta su estado de asistencia.
            </Text>
          </Stack>
          <Button style={{ backgroundColor: "#797E5E", color: "#FFF" }} leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
            Nuevo Invitado
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

      <Paper p={{ base: "xs", sm: "md" }} radius="md" withBorder style={{ backgroundColor: "#FFF", width: "100%", overflow: "hidden" }}>
        <Group justify="space-between" mb="md" wrap="wrap" gap="sm">
          <TextInput
            placeholder="Buscar por nombre o familia..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 180 }}
          />

          <Group gap="xs" wrap="wrap">
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

            <Select
              placeholder="Estado"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val || "ALL")}
              data={[
                { label: "Todos los Estados", value: "ALL" },
                { label: "Confirmados", value: "CONFIRMED" },
                { label: "Pendientes", value: "PENDING" },
                { label: "Rechazados", value: "DECLINED" },
              ]}
              style={{ width: 155 }}
              styles={{
                input: { backgroundColor: "#FAF8F5", borderColor: "#DDD", color: "#4A503D" },
              }}
            />

            <ActionIcon variant="light" color="gray" onClick={fetchData} size="lg">
              <IconRefresh size={16} />
            </ActionIcon>
          </Group>
        </Group>

        {loading ? (
          <Stack align="center" py="xl">
            <Loader color="amber" size="md" />
          </Stack>
        ) : filteredGuests.length === 0 ? (
          <Stack align="center" py="xl">
            <IconUsers size={36} color="#CCC" />
            <Text c="dimmed">No se encontraron invitados con los criterios seleccionados.</Text>
          </Stack>
        ) : (
          <Box style={{ overflowX: "auto", width: "100%", WebkitOverflowScrolling: "touch" }}>
            <Table highlightOnHover verticalSpacing="sm" style={{ minWidth: 850 }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 100 }}>Enviada</Table.Th>
                  <Table.Th>Nombre Completo</Table.Th>
                  <Table.Th>Invitado por (Lado)</Table.Th>
                  <Table.Th>Familia / Invitación</Table.Th>
                  <Table.Th>Contacto (Celular)</Table.Th>
                  <Table.Th>Estado Asistencia</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredGuests.map((gst) => {
                  const status = gst.confirmation?.status || "PENDING";
                  const side = gst.side || "BOTH";
                  const isSent = gst.invitation?.invitationDeliveries?.some((d) => d.status === "SENT") || false;

                  return (
                    <Table.Tr key={gst.idGuest}>
                      <Table.Td>
                        <Tooltip label={isSent ? "Enviada (Clic para desmarcar)" : "Marcar como enviada"}>
                          <Group gap={6} style={{ cursor: "pointer" }} onClick={() => handleToggleSent(gst)}>
                            <Checkbox
                              checked={isSent}
                              onChange={() => {}}
                              color="teal"
                              size="sm"
                              style={{ cursor: "pointer" }}
                            />
                            {isSent ? (
                              <Badge size="xs" color="teal" variant="light">
                                Enviada
                              </Badge>
                            ) : (
                              <Badge size="xs" color="gray" variant="subtle">
                                No
                              </Badge>
                            )}
                          </Group>
                        </Tooltip>
                      </Table.Td>
                      <Table.Td fw={600} style={{ color: "#4A3F35" }}>
                        {gst.name}
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
                        <Badge variant="outline" color="amber">
                          {gst.invitation?.familyName || "Invitación Individual"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={0}>
                          <Text size="xs" fw={500}>{gst.phoneNumber}</Text>
                          {gst.email && <Text size="xs" c="dimmed">{gst.email}</Text>}
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        {status === "CONFIRMED" && (
                          <Badge color="teal" variant="light" leftSection={<IconUserCheck size={12} />}>
                            Confirmado
                          </Badge>
                        )}
                        {status === "PENDING" && (
                          <Badge color="orange" variant="light" leftSection={<IconClock size={12} />}>
                            Pendiente
                          </Badge>
                        )}
                        {status === "DECLINED" && (
                          <Badge color="red" variant="light" leftSection={<IconUserX size={12} />}>
                            Rechazado
                          </Badge>
                        )}
                      </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Group gap="xs" justify="flex-end">
                        <Tooltip label="Enviar invitación por WhatsApp al invitado">
                          <ActionIcon
                            variant="light"
                            color="teal"
                            onClick={() => handleSendWhatsApp(gst)}
                          >
                            <IconBrandWhatsapp size={18} />
                          </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Editar invitado">
                          <ActionIcon variant="light" color="amber" onClick={() => handleOpenEdit(gst)}>
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Eliminar invitado">
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => {
                              setGuestToDelete(gst);
                              openDeleteModal();
                            }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
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

      {/* Modal Crear/Editar */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={editingGuest ? "Editar Invitado" : "Nuevo Invitado"}
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nombre Completo"
              placeholder="Ej. María Montoya"
              required
              {...form.getInputProps("name")}
            />

            <Stack gap={4}>
              <Text size="sm" fw={500}>Teléfono / Celular con Indicativo de País *</Text>
              <Group align="flex-start" wrap="wrap" gap="xs">
                <Select
                  aria-label="Indicativo de País"
                  data={COUNTRY_CODES}
                  value={form.values.countryCode}
                  onChange={(val) => form.setFieldValue("countryCode", val || "+57")}
                  style={{ flex: "1 1 180px", minWidth: 160 }}
                  searchable
                />
                {form.values.countryCode === "OTHER" && (
                  <TextInput
                    aria-label="Indicativo Personalizado"
                    placeholder="Ej. +43"
                    required
                    {...form.getInputProps("customCountryCode")}
                    style={{ flex: "1 1 110px", minWidth: 100 }}
                  />
                )}
                <TextInput
                  aria-label="Número de Celular"
                  placeholder="Ej. 3205832210 o 2035568068"
                  required
                  {...form.getInputProps("phoneBody")}
                  style={{ flex: "2 1 180px", minWidth: 160 }}
                />
              </Group>
              {form.errors.phoneBody && (
                <Text color="red" size="xs">{form.errors.phoneBody}</Text>
              )}
              {form.errors.customCountryCode && (
                <Text color="red" size="xs">{form.errors.customCountryCode}</Text>
              )}
            </Stack>

            <Select
              label="Familia / Invitación Asignada (Opcional)"
              placeholder="Selecciona la familia o déjalo para invitación individual"
              clearable
              data={invitationsList.map((inv) => ({
                value: String(inv.idInvitation),
                label: `${inv.familyName} (${inv.side === "PEDRO" ? "💙 Pedro" : inv.side === "CATA" ? "🩷 Cata" : "💑 Ambos"})`,
              }))}
              value={form.values.invitationId}
              onChange={(val) => {
                const selectedInvId = val || "";
                form.setFieldValue("invitationId", selectedInvId);
                if (selectedInvId) {
                  const selectedInv = invitationsList.find((i) => String(i.idInvitation) === selectedInvId);
                  if (selectedInv) {
                    form.setFieldValue("side", selectedInv.side);
                  }
                }
              }}
            />

            <Select
              label="Invitado por (Lado de la Familia)"
              placeholder="Selecciona el lado (Pedro, Cata o Ambos)"
              clearable={!form.values.invitationId}
              disabled={!!form.values.invitationId}
              data={[
                { value: "PEDRO", label: "💙 Pedro" },
                { value: "CATA", label: "🩷 Cata" },
                { value: "BOTH", label: "💑 Ambos / Amigos en Común" },
              ]}
              required
              {...form.getInputProps("side")}
              description={
                form.values.invitationId
                  ? "🔒 Lado asignado automáticamente por la familia seleccionada."
                  : undefined
              }
            />

            <TextInput
              label="Correo Electrónico (Opcional)"
              placeholder="maria@ejemplo.com"
              {...form.getInputProps("email")}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="outline" color="gray" onClick={closeModal}>
                Cancelar
              </Button>
              <Button style={{ backgroundColor: "#797E5E", color: "#FFF" }} type="submit" loading={submitting}>
                {editingGuest ? "Guardar Cambios" : "Registrar Invitado"}
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
            ¿Deseas eliminar a <strong>{guestToDelete?.name}</strong> de la lista de invitados?
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

export default GuestsPage;
