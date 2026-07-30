import { createTheme, type MantineColorsTuple } from "@mantine/core";

// Tupla de 10 tonalidades basada en el dorado/beige de la boda (#DED1C1)
const weddingGold: MantineColorsTuple = [
  "#fbf9f6",
  "#f5f1eb",
  "#ece3d6",
  "#ded1c1", // Color base principal de la boda
  "#cfbd9f",
  "#c1a681",
  "#b49168",
  "#9d7753",
  "#806043",
  "#694e37",
];

export const theme = createTheme({
  primaryColor: "weddingGold",
  colors: {
    weddingGold,
  },
  other: {
    bgCream: "#FCFBF5", // Color crema de fondo para la landing e invitación
  },
});
