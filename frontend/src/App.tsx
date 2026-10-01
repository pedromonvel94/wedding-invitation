import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingLayout from "./layouts/LandingLayout";
import AdminLayout from "./layouts/AdminLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import DashboardPage from "./pages/DashboardPage";
import AdminManagementPage from "./pages/AdminManagementPage";
import InvitationsPage from "./pages/InvitationsPage";
import GuestsPage from "./pages/GuestsPage";
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

          {/* Rutas de Autenticación */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/change-password" element={<ChangePasswordPage />} />

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
