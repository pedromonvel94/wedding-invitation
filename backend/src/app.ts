import express, { Application } from "express";
import healthRoutes from "./routes/health.routes.js";
import loginRoutes from "./routes/login.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import guestRoutes from "./routes/guest.routes.js";
import confirmationRoutes from "./routes/confirmation.routes.js";
import invitationDeliveryRoutes from "./routes/invitation-delivery.routes.js";
import publicRoutes from "./routes/public.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminManagementRoutes from "./routes/admin-management.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Inicializar la aplicación Express
const app: Application = express();

// Middlewares globales
app.use(cors(corsOptions));
app.use(express.json());

// Rutas públicas (sin prefix /api)
app.use(healthRoutes);

// Rutas de la API
app.use("/api", publicRoutes);
app.use("/api", authRoutes);
app.use("/api", adminManagementRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", loginRoutes);
app.use("/api", invitationRoutes);
app.use("/api", guestRoutes);
app.use("/api", confirmationRoutes);
app.use("/api", invitationDeliveryRoutes);

// Middleware de manejo de errores centralizado
app.use(errorHandler);

export default app;
