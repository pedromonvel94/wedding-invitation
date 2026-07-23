import express, { Application } from "express";
import healthRoutes from "./routes/health.routes.js";
import loginRoutes from "./routes/login.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import guestRoutes from "./routes/guest.routes.js";
import confirmationRoutes from "./routes/confirmation.routes.js";
import invitationDeliveryRoutes from "./routes/invitation-delivery.routes.js";

// Inicializar la aplicación Express
const app: Application = express();

// Middlewares globales
app.use(express.json());

// Rutas públicas (sin prefix /api)
app.use(healthRoutes);

// Rutas de la API (con prefix /api para que no haya conflictos con las rutas de la invitacion)
app.use("/api", loginRoutes);
app.use("/api", invitationRoutes);
app.use("/api", guestRoutes);
app.use("/api", confirmationRoutes);
app.use("/api", invitationDeliveryRoutes);

export default app;
