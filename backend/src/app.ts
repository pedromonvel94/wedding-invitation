import express, { Application } from "express";
import healthRoutes from "./routes/health.routes.js";

// Inicializar la aplicación Express
const app: Application = express();

// Middlewares globales
app.use(express.json());

// Aqui uso las rutas para que express las reconozca y pueda usarlas
app.use(healthRoutes);

export default app;
