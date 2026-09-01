import { createTheme, type MantineColorsTuple } from "@mantine/core";

// Tupla de 10 tonalidades basada en el Verde Olivo oficial (#797E5E)
const oliveGreen: MantineColorsTuple = [
  "#f4f5f0",
  "#e6e8de",
  "#cfd2bf",
  "#b5ba9d",
  "#9fa581",
  "#797e5e", // Base Verde Olivo (#797E5E)
  "#62664b",
  "#4d513b",
  "#393b2c",
  "#26271d",
];

export const theme = createTheme({
  primaryColor: "oliveGreen",
  fontFamily: "Arvo, serif",
  headings: {
    fontFamily: "Prata, serif",
  },
  colors: {
    oliveGreen,
  },
  other: {
    bgCream: "#F7F4EB", // Beige Marfil Cálido para fondos
    textDark: "#2B2826", // Café Oscuro para texto en fondos beige
    greenAccent: "#797E5E", // Verde Olivo de la decoración y sobre
    fontScript: "'Great Vibes', cursive", // Fuente para "Juan Pedro & Catalina"
  },
});
