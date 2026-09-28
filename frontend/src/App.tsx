import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingLayout from "./layouts/LandingLayout";
import AdminLayout from "./layouts/AdminLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminManagementPage from "./pages/AdminManagementPage";
import InvitationsPage from "./pages/InvitationsPage";
import GuestsPage from "./pages/GuestsPage";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas de la Invitación */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Ruta Pública de Aceptación de Invitación para Admin */}
          <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />

          {/* Ruta de Login del Administrador */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Rutas Privadas Protegidas del Panel de Administración */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/invitations" element={<InvitationsPage />} />
              <Route path="/admin/guests" element={<GuestsPage />} />
              <Route path="/admin/admins" element={<AdminManagementPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
