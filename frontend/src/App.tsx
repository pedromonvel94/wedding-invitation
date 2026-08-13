import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas de la Invitación */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Ruta de Login del Administrador */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Rutas Privadas del Panel de Administración */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
