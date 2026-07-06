import js from "@eslint/js"; // Importo el plugin de ESLint para JavaScript
import tsParser from "@typescript-eslint/parser"; // Importo el parser de TypeScript
import tseslint from "typescript-eslint"; // Importo el plugin de TypeScript para ESLint
import { defineConfig } from "eslint/config"; // Importo la función defineConfig de ESLint para definir la configuración
import eslintConfigPrettier from "eslint-config-prettier"; // Importo la configuración de Prettier para ESLint

export default defineConfig({
  files: ["**/*.{js,ts}"], // Indico que se analizaran archivos JavaScript y TypeScript
  languageOptions: {
    parser: tsParser, // Asigno el parser de TypeScript
    parserOptions: {
      project: "./tsconfig.json", // Opcional: ruta a tu tsconfig.json (necesario para reglas que requieren chequeo de tipos)
    },
  },
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    eslintConfigPrettier, // Extiendo la configuración de Prettier para evitar conflictos con ESLint
  ], //Aplico las configuraciones recomendadas de ESLint y TypeScript
});
