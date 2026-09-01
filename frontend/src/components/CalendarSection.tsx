import { useState, useEffect } from "react";
import { Box, Text, Title, SimpleGrid, Group, Stack } from "@mantine/core";

export function CalendarSection() {
  const daysOfWeek = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

  const calendarDays = [
    "",
    "1", "2", "3", "4", "5", "6",
    "7", "8", "9", "10", "11", "12", "13",
    "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27",
    "28", "29", "30", "31",
  ];

  // Estado del Contador Regresivo en vivo hasta el 13 de Diciembre de 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-12-13T16:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      style={{
        width: "100%",
        backgroundColor: "#797E5E",
        color: "#F7F4EB",
        padding: "40px 20px 48px 20px",
        textAlign: "center",
        boxSizing: "border-box",
        marginTop: "24px",
      }}
    >
      {/* 1. Frase de Invitación */}
      <Text
        style={{
          fontFamily: "var(--font-subtitle)",
          fontSize: "0.95rem",
          fontStyle: "italic",
          maxWidth: "340px",
          margin: "0 auto 36px auto",
          color: "#F7F4EB",
          lineHeight: 1.6,
        }}
      >
        “Porque tú has sido parte de nuestra historia, queremos que seas parte de nuestro mejor capítulo, te esperamos”
      </Text>

      {/* 2. Bloque de Fecha Enmarcado */}
      <Text
        style={{
          fontFamily: "var(--font-subtitle)",
          letterSpacing: "3px",
          fontSize: "0.85rem",
          marginBottom: "16px",
          color: "#F7F4EB",
        }}
      >
        DICIEMBRE
      </Text>

      <Group justify="center" align="center" gap={28} style={{ marginBottom: "40px" }}>
        <Box style={{ borderBottom: "1px solid #F7F4EB", width: "80px", paddingBottom: "4px", marginRight: "6px" }}>
          <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.85rem", letterSpacing: "2px" }}>
            DOMINGO
          </Text>
        </Box>
        <Text style={{ fontFamily: "var(--font-title)", fontSize: "4.2rem", lineHeight: 0.8, color: "#F7F4EB", margin: "0 6px" }}>
          13
        </Text>
        <Box style={{ borderBottom: "1px solid #F7F4EB", width: "80px", paddingBottom: "4px", marginLeft: "6px" }}>
          <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.85rem", letterSpacing: "2px" }}>
            2026
          </Text>
        </Box>
      </Group>

      {/* 3. Conteo Regresivo en vivo */}
      <Text style={{ fontFamily: "var(--font-subtitle)", letterSpacing: "3px", fontSize: "0.85rem", marginBottom: "16px" }}>
        FALTAN
      </Text>

      <Group justify="center" gap="xs" style={{ marginBottom: "40px" }}>
        {[
          { label: "Días", value: timeLeft.days },
          { label: "Horas", value: String(timeLeft.hours).padStart(2, "0") },
          { label: "Min", value: String(timeLeft.minutes).padStart(2, "0") },
          { label: "Seg", value: String(timeLeft.seconds).padStart(2, "0") },
        ].map((item, idx) => (
          <Group key={idx} gap={4} align="center">
            <Stack gap={2} align="center">
              <Text style={{ fontFamily: "var(--font-subtitle)", fontSize: "1.8rem", fontWeight: "normal" }}>
                {item.value}
              </Text>
              <Text size="xs" style={{ fontFamily: "var(--font-body)", opacity: 0.8 }}>
                {item.label}
              </Text>
            </Stack>
            {idx < 3 && (
              <Text style={{ fontSize: "1.6rem", margin: "0 4px", opacity: 0.8 }}>:</Text>
            )}
          </Group>
        ))}
      </Group>

      {/* 4. Calendario con Corazón en el día 13 */}
      <Text style={{ fontFamily: "var(--font-subtitle)", letterSpacing: "3px", fontSize: "0.85rem", marginBottom: "6px" }}>
        EL GRAN DÍA
      </Text>
      <Title order={2} style={{ fontFamily: "var(--font-title)", fontSize: "2.6rem", fontWeight: "normal", marginBottom: "20px", color: "#F7F4EB" }}>
        Diciembre 2026
      </Title>

      <SimpleGrid cols={7} spacing="xs" style={{ marginBottom: "16px" }}>
        {daysOfWeek.map((day, idx) => (
          <Text key={idx} style={{ fontFamily: "var(--font-subtitle)", fontSize: "0.75rem", opacity: 0.9 }}>
            {day}
          </Text>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={7} spacing="xs">
        {calendarDays.map((day, idx) => (
          <Box key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "36px" }}>
            {day === "13" ? (
              <Box style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#F7F4EB" strokeWidth="1.5" style={{ position: "absolute", width: "38px", height: "38px" }}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <Text style={{ fontFamily: "var(--font-body)", fontWeight: "bold", fontSize: "0.95rem", zIndex: 2 }}>
                  13
                </Text>
              </Box>
            ) : (
              <Text style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", opacity: day ? 1 : 0 }}>
                {day}
              </Text>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default CalendarSection;
